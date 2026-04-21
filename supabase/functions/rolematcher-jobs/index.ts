import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function deriveSearchQuery(jobDescription: string) {
  const cleaned = stripHtml(jobDescription).slice(0, 3500)
  const titleMatch = cleaned.match(
    /\b(?:job title|title|role|position)\s*[:\-]\s*([A-Za-z0-9+#./&,\-\s]{3,80})/i
  )

  if (titleMatch?.[1]) {
    return titleMatch[1]
      .split(/[.;|]/)[0]
      .replace(/\b(remote|hybrid|full time|part time|contract)\b/gi, '')
      .trim()
      .slice(0, 80)
  }

  const commonRole = cleaned.match(
    /\b(frontend|front-end|backend|back-end|full stack|software|data|product|ux|ui|devops|cloud|security|qa|machine learning|ai)\s+(engineer|developer|designer|analyst|manager|specialist|scientist)\b/i
  )

  if (commonRole?.[0]) return commonRole[0]

  const keywordMatches = cleaned.match(
    /\b(react|typescript|javascript|python|java|sql|aws|azure|node|express|django|flask|spring|figma|salesforce|excel|tableau|power bi|data analyst|frontend developer|software engineer)\b/gi
  )

  if (keywordMatches?.length) {
    return Array.from(new Set(keywordMatches.map(item => item.toLowerCase()))).slice(0, 4).join(' ')
  }

  return cleaned.split(/\s+/).slice(0, 6).join(' ')
}

function tokenize(value: string) {
  return stripHtml(value)
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/i)
    .map(token => token.trim())
    .filter(token => token.length > 2 && !['and', 'the', 'with', 'for', 'you', 'our', 'are'].includes(token))
}

function scoreJob(job: any, targetRole: string, keywords: string[]) {
  const title = stripHtml(String(job?.title || '')).toLowerCase()
  const description = stripHtml(String(job?.description || '')).toLowerCase()
  const targetTokens = tokenize(targetRole)
  const keywordTokens = keywords.flatMap(tokenize)
  let score = 0

  for (const token of targetTokens) {
    if (title.includes(token)) score += 5
    if (description.includes(token)) score += 1
  }

  for (const token of keywordTokens) {
    if (title.includes(token)) score += 2
    if (description.includes(token)) score += 1
  }

  return score
}

function normalizeJob(job: any, relevanceScore = 0) {
  return {
    id: String(job?.id || job?.redirect_url || crypto.randomUUID()),
    title: stripHtml(String(job?.title || 'Untitled role')),
    company: stripHtml(String(job?.company?.display_name || 'Company not listed')),
    location: stripHtml(String(job?.location?.display_name || 'Location not listed')),
    description: stripHtml(String(job?.description || '')).slice(0, 220),
    url: String(job?.redirect_url || ''),
    created: String(job?.created || ''),
    salaryMin: typeof job?.salary_min === 'number' ? job.salary_min : null,
    salaryMax: typeof job?.salary_max === 'number' ? job.salary_max : null,
    relevanceScore,
    source: 'Adzuna',
  }
}

Deno.serve(async request => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405)
  }

  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization) {
      return jsonResponse({ ok: false, error: 'Missing auth header' }, 401)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ ok: false, error: 'Missing Supabase runtime secrets' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    }

    const appId = Deno.env.get('ADZUNA_APP_ID')
    const appKey = Deno.env.get('ADZUNA_APP_KEY')
    if (!appId || !appKey) {
      return jsonResponse({ ok: false, error: 'Missing ADZUNA_APP_ID or ADZUNA_APP_KEY secret' }, 500)
    }

    const payload = await request.json()
    const jobDescription = typeof payload?.jobDescription === 'string' ? payload.jobDescription : ''
    const targetRole = typeof payload?.targetRole === 'string' ? payload.targetRole.trim() : ''
    const keywords = Array.isArray(payload?.keywords)
      ? payload.keywords.map((keyword: unknown) => String(keyword).trim()).filter(Boolean).slice(0, 5)
      : []
    const location = typeof payload?.location === 'string' ? payload.location.trim() : ''
    const limit = Math.min(Math.max(Number(payload?.limit) || 8, 1), 24)
    const query = targetRole || deriveSearchQuery(jobDescription)

    if (!query) {
      return jsonResponse({ ok: false, error: 'Add a job description before searching for related jobs.' }, 400)
    }

    const queryKeywords = keywords.slice(0, 2).join(' ')
    const providerLimit = Math.min(Math.max(limit * 4, 16), 50)
    const params = new URLSearchParams({
      app_id: appId,
      app_key: appKey,
      what: [query, queryKeywords].filter(Boolean).join(' '),
      results_per_page: String(providerLimit),
      sort_by: 'date',
    })

    if (location) params.set('where', location)

    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${params.toString()}`)
    const responseText = await response.text()
    let data: any = null

    try {
      data = responseText ? JSON.parse(responseText) : null
    } catch {
      return jsonResponse(
        {
          ok: false,
          error:
            response.status === 401
              ? 'Adzuna authorization failed. Check that ADZUNA_APP_ID and ADZUNA_APP_KEY match your Adzuna dashboard exactly.'
              : 'The jobs provider returned a non-JSON response. Check ADZUNA_APP_ID and ADZUNA_APP_KEY in Supabase secrets.',
        },
        502
      )
    }

    if (!response.ok) {
      return jsonResponse(
        {
          ok: false,
          error: data?.error || data?.message || 'Job API request failed',
        },
        response.status
      )
    }

    const jobs = Array.isArray(data?.results)
      ? data.results
          .map((job: any) => ({ job, relevanceScore: scoreJob(job, query, keywords) }))
          .sort((a: any, b: any) => {
            const scoreDiff = b.relevanceScore - a.relevanceScore
            if (scoreDiff !== 0) return scoreDiff
            return new Date(b.job?.created || 0).getTime() - new Date(a.job?.created || 0).getTime()
          })
          .slice(0, limit)
          .map((item: any) => normalizeJob(item.job, item.relevanceScore))
      : []

    return jsonResponse({
      ok: true,
      provider: 'adzuna',
      query,
      keywords,
      jobs,
    })
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unexpected jobs function error',
      },
      500
    )
  }
})
