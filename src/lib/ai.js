import { supabase } from './supabase'

export function extractJson(text) {
  if (!text) throw new Error('Empty model response')

  const cleaned = text.replace(/```json|```/gi, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1))
    }
    throw new Error('Model returned invalid JSON')
  }
}

export async function callAiBackend(messages, maxTokens = 1800) {
  const { data, error } = await supabase.functions.invoke('rolematcher-ai', {
    body: {
      messages,
      maxTokens,
    },
  })

  if (error) {
    throw new Error(error.message || 'AI request failed')
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'AI request failed')
  }

  return extractJson(data.content || '')
}
