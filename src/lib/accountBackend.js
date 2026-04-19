import { supabase } from './supabase'

async function extractInvokeError(error) {
  if (!error) return 'Account request failed'

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

  return error.message || 'Account request failed'
}

async function invokeAccountFunction(action, payload = {}) {
  const { data, error } = await supabase.functions.invoke('rolematcher-account', {
    body: {
      action,
      ...payload,
    },
  })

  if (error) {
    throw new Error(await extractInvokeError(error))
  }

  if (!data?.ok) {
    throw new Error(data?.error || 'Account request failed')
  }

  return data
}

export async function updateOwnBilling(payload) {
  return invokeAccountFunction('self_billing_update', payload)
}

export async function updateOwnSubscription(payload) {
  return invokeAccountFunction('self_subscription_update', payload)
}

export async function updateAdminSubscription(payload) {
  return invokeAccountFunction('admin_subscription_update', payload)
}

export async function resetAdminUsage(payload) {
  return invokeAccountFunction('admin_reset_usage', payload)
}

export async function updateAdminRole(payload) {
  return invokeAccountFunction('admin_role_update', payload)
}
