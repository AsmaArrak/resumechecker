import { supabase } from './supabase'

export function extractJson(text) {
  if (!text) throw new Error('Empty model response')

  const cleaned = text.replace(/```json|```/gi, '').trim()
  const repairJson = value =>
    value
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')

  try {
    return JSON.parse(cleaned)
  } catch {
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSlice = cleaned.slice(firstBrace, lastBrace + 1)
      try {
        return JSON.parse(jsonSlice)
      } catch {
        return JSON.parse(repairJson(jsonSlice))
      }
    }
    throw new Error('Model returned invalid JSON')
  }
}

async function invokeAi(messages, maxTokens) {
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

  return data.content || ''
}

export async function callAiBackend(messages, maxTokens = 1800) {
  const content = await invokeAi(messages, maxTokens)

  try {
    return extractJson(content)
  } catch (parseError) {
    const repairedContent = await invokeAi(
      [
        {
          role: 'system',
          content:
            'You repair invalid JSON. Return only valid JSON. Do not add markdown, comments, explanations, or code fences.',
        },
        {
          role: 'user',
          content: `The previous model response was supposed to be JSON but failed to parse with this error:
${parseError.message}

Repair the response below into valid JSON only. Preserve the same data and structure. Fix broken arrays, trailing commas, missing quotes, and unescaped quotation marks.

INVALID RESPONSE:
${content.slice(0, 12000)}`,
        },
      ],
      maxTokens
    )

    return extractJson(repairedContent)
  }
}
