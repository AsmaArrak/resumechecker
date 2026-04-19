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

function normalizeMessages(messages: unknown) {
  if (!Array.isArray(messages) || !messages.length) {
    throw new Error('messages must be a non-empty array')
  }

  return messages.map((message) => {
    const role = typeof message?.role === 'string' ? message.role : 'user'
    const content = typeof message?.content === 'string' ? message.content : ''
    return { role, content }
  })
}

async function callGroq(messages: Array<{ role: string; content: string }>, maxTokens: number) {
  const apiKey = Deno.env.get('GROQ_API_KEY')
  if (!apiKey) {
    throw new Error('Missing GROQ_API_KEY secret')
  }

  const model = Deno.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile'
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: maxTokens,
      messages,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Groq request failed')
  }

  return data?.choices?.[0]?.message?.content || ''
}

function flattenOpenAIResponse(data: any) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text
  }

  const output = Array.isArray(data?.output) ? data.output : []
  const chunks = output.flatMap((item: any) =>
    Array.isArray(item?.content)
      ? item.content
          .map((contentItem: any) => (typeof contentItem?.text === 'string' ? contentItem.text : ''))
          .filter(Boolean)
      : []
  )

  return chunks.join('\n').trim()
}

async function callOpenAI(messages: Array<{ role: string; content: string }>, maxTokens: number) {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY secret')
  }

  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-5.4-mini'
  const systemInstructions = messages
    .filter((message) => message.role === 'system')
    .map((message) => message.content)
    .join('\n\n')

  const input = messages
    .filter((message) => message.role !== 'system')
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join('\n\n')

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions: systemInstructions || undefined,
      input,
      max_output_tokens: maxTokens,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenAI request failed')
  }

  return flattenOpenAIResponse(data)
}

Deno.serve(async (request) => {
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

    const payload = await request.json()
    const messages = normalizeMessages(payload?.messages)
    const maxTokens = typeof payload?.maxTokens === 'number' ? payload.maxTokens : 1800

    const provider = (Deno.env.get('AI_PROVIDER') || (Deno.env.get('OPENAI_API_KEY') ? 'openai' : 'groq')).toLowerCase()
    const content =
      provider === 'openai'
        ? await callOpenAI(messages, maxTokens)
        : await callGroq(messages, maxTokens)

    return jsonResponse({
      ok: true,
      provider,
      content,
    })
  } catch (error) {
    return jsonResponse(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unexpected function error',
      },
      500
    )
  }
})
