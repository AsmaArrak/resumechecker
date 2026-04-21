import { supabase } from './supabase'

async function extractInvokeError(error) {
  if (!error) return 'Job recommendations request failed'

  const context = error.context

  if (context?.json) {
    try {
      const payload = await context.json()
      if (payload?.error) return payload.error
      if (payload?.message) return payload.message
    } catch {}
  }

  if (context?.text) {
    try {
      const text = await context.text()
      if (text) return text
    } catch {}
  }

  return error.message || 'Job recommendations request failed'
}

export async function fetchRecommendedJobs({
  jobDescription,
  targetRole = '',
  keywords = [],
  location = '',
  limit = 8,
}) {
  let data
  let error

  try {
    const response = await supabase.functions.invoke('rolematcher-jobs', {
      body: {
        jobDescription,
        targetRole,
        keywords,
        location,
        limit,
      },
    })

    data = response.data
    error = response.error
  } catch (invokeError) {
    const message = invokeError instanceof Error ? invokeError.message : ''

    if (message.includes('<!DOCTYPE')) {
      throw new Error('Job recommendations returned an HTML error page. Check the jobs API credentials and try again.')
    }

    throw invokeError
  }

  if (error) {
    const message = await extractInvokeError(error)

    if (message.includes('<!DOCTYPE')) {
      throw new Error('Job recommendations returned an HTML error page. Check the jobs API credentials and try again.')
    }

    throw new Error(message)
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'Job recommendations request failed')
  }

  return Array.isArray(data.jobs) ? data.jobs : []
}
