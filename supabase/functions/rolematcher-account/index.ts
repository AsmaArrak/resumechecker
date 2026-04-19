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

function getRuntimeEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

async function getAuthenticatedUser(request: Request) {
  const authorization = request.headers.get('Authorization')
  if (!authorization) {
    throw new Error('Missing auth header')
  }

  const token = authorization.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    throw new Error('Missing access token')
  }

  const response = await fetch(`${getRuntimeEnv('SUPABASE_URL')}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: getRuntimeEnv('SUPABASE_ANON_KEY'),
    },
  })

  if (!response.ok) {
    throw new Error('Unauthorized')
  }

  const user = await response.json()
  if (!user?.id) {
    throw new Error('Unauthorized')
  }

  return { user }
}

async function getIsAdmin(adminClient: ReturnType<typeof createClient>, userId: string) {
  const { data, error } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data?.role === 'admin'
}

async function upsertSubscription(adminClient: ReturnType<typeof createClient>, payload: Record<string, unknown>) {
  const { data, error } = await adminClient
    .from('subscriptions')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405)
  }

  try {
    const adminClient = createClient(
      getRuntimeEnv('SUPABASE_URL'),
      getRuntimeEnv('SUPABASE_SERVICE_ROLE_KEY')
    )
    const { user } = await getAuthenticatedUser(request)
    const payload = await request.json()
    const action = typeof payload?.action === 'string' ? payload.action : ''

    if (action === 'self_billing_update') {
      const subscription = await upsertSubscription(adminClient, {
        user_id: user.id,
        billing_email: typeof payload?.billing_email === 'string' ? payload.billing_email : user.email ?? '',
        provider: typeof payload?.provider === 'string' ? payload.provider : 'manual',
      })

      return jsonResponse({ ok: true, subscription })
    }

    if (action === 'self_subscription_update') {
      const subscription = await upsertSubscription(adminClient, {
        user_id: user.id,
        billing_email: typeof payload?.billing_email === 'string' ? payload.billing_email : user.email ?? '',
        provider: typeof payload?.provider === 'string' ? payload.provider : 'manual',
        plan: typeof payload?.plan === 'string' ? payload.plan : 'free',
        status: typeof payload?.status === 'string' ? payload.status : 'free',
        auto_renew: Boolean(payload?.auto_renew),
        current_period_end: payload?.current_period_end ?? null,
      })

      return jsonResponse({ ok: true, subscription })
    }
    const isAdmin = await getIsAdmin(adminClient, user.id)

    if (!isAdmin) {
      return jsonResponse({ ok: false, error: 'Admin access required' }, 403)
    }

    if (action === 'admin_subscription_update') {
      const userId = typeof payload?.userId === 'string' ? payload.userId : ''
      if (!userId) {
        return jsonResponse({ ok: false, error: 'Missing userId' }, 400)
      }

      const subscription = await upsertSubscription(adminClient, {
        user_id: userId,
        billing_email: typeof payload?.billing_email === 'string' ? payload.billing_email : '',
        provider: typeof payload?.provider === 'string' ? payload.provider : 'manual',
        plan: typeof payload?.plan === 'string' ? payload.plan : 'free',
        status: typeof payload?.status === 'string' ? payload.status : 'free',
        auto_renew: Boolean(payload?.auto_renew),
        current_period_end: payload?.current_period_end ?? null,
      })

      return jsonResponse({ ok: true, subscription })
    }

    if (action === 'admin_reset_usage') {
      const userId = typeof payload?.userId === 'string' ? payload.userId : ''
      if (!userId) {
        return jsonResponse({ ok: false, error: 'Missing userId' }, 400)
      }

      const { error } = await adminClient.from('usage_windows').upsert(
        {
          user_id: userId,
          window_start: new Date().toISOString(),
          score_checks_used: 0,
          resume_generations_used: 0,
        },
        { onConflict: 'user_id' }
      )

      if (error) {
        throw new Error(error.message)
      }

      return jsonResponse({ ok: true })
    }

    if (action === 'admin_role_update') {
      const userId = typeof payload?.userId === 'string' ? payload.userId : ''
      const role = typeof payload?.role === 'string' ? payload.role : ''
      if (!userId || !['user', 'admin'].includes(role)) {
        return jsonResponse({ ok: false, error: 'Invalid role update request' }, 400)
      }

      const { error } = await adminClient
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id' })

      if (error) {
        throw new Error(error.message)
      }

      return jsonResponse({ ok: true })
    }

    return jsonResponse({ ok: false, error: 'Unsupported action' }, 400)
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
