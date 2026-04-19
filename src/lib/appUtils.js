export const PLAN_CONFIG = {
  free: {
    label: 'Free',
    dailyAnalyses: 2,
    dailyGenerations: 2,
    monthlyPrice: 0,
    badge: '100% Free Beta',
  },
  plus: {
    label: 'Plus',
    dailyAnalyses: 12,
    dailyGenerations: 12,
    monthlyPrice: 9.99,
    badge: 'Most Popular',
  },
  pro: {
    label: 'Pro',
    dailyAnalyses: 20,
    dailyGenerations: 20,
    monthlyPrice: 14.99,
    badge: 'High Volume',
  },
}

export function normalizeArray(value) {
  return Array.isArray(value) ? value : []
}

export function normalizeRequirementAssessments(value) {
  return normalizeArray(value)
    .map(item => ({
      requirement: typeof item?.requirement === 'string' ? item.requirement.trim() : '',
      priority: typeof item?.priority === 'string' ? item.priority.trim() : '',
      verdict: typeof item?.verdict === 'string' ? item.verdict.trim() : '',
      evidence: typeof item?.evidence === 'string' ? item.evidence.trim() : '',
    }))
    .filter(item => item.requirement && item.verdict)
    .slice(0, 8)
}

export function compactResume(parsed) {
  const compactExperience = normalizeArray(parsed.experience).map((exp, index) => ({
    ...exp,
    bullets: normalizeArray(exp.bullets).slice(0, index === 0 ? 3 : 2),
  }))

  const compactProjects = normalizeArray(parsed.projects)
    .slice(0, 3)
    .map(project => ({
      ...project,
      bullets: normalizeArray(project.bullets).slice(0, 2),
    }))

  const summaryText = typeof parsed.summary === 'string' ? parsed.summary.trim() : ''
  const summarySentences = summaryText
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .join(' ')

  return {
    name: parsed.name || '',
    title: parsed.title || '',
    contact: parsed.contact || '',
    summary: summarySentences,
    technical_skills: parsed.technical_skills || {
      Languages: [],
      Frontend: [],
      Backend: [],
      Databases: [],
      DevOpsAndTools: [],
      CloudPlatforms: [],
      DesignAndPM: [],
    },
    experience: compactExperience,
    projects: compactProjects,
    education: parsed.education || [],
  }
}

export function formatCountdown(ms) {
  if (!ms || ms <= 0) return '00d 00h 00m 00s'

  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [
    `${String(days).padStart(2, '0')}d`,
    `${String(hours).padStart(2, '0')}h`,
    `${String(minutes).padStart(2, '0')}m`,
    `${String(seconds).padStart(2, '0')}s`,
  ].join(' ')
}

export function formatResetTime(value) {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value || 0)
}

export function getPlanConfig(plan) {
  return PLAN_CONFIG[plan] || PLAN_CONFIG.free
}

export function sortAdminUsers(users) {
  return [...users].sort((a, b) => {
    const aValue = (a.subscription?.plan !== 'free' ? 1 : 0) + (a.role === 'admin' ? 1 : 0)
    const bValue = (b.subscription?.plan !== 'free' ? 1 : 0) + (b.role === 'admin' ? 1 : 0)
    return bValue - aValue || new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })
}

export function summarizeAdminUsers(users) {
  return {
    totalUsers: users.length,
    activePro: users.filter(
      item =>
        (item.subscription?.plan === 'plus' || item.subscription?.plan === 'pro') &&
        item.subscription?.status === 'active'
    ).length,
    pausedPro: users.filter(
      item =>
        (item.subscription?.plan === 'plus' || item.subscription?.plan === 'pro') &&
        item.subscription?.status === 'paused'
    ).length,
    projectedMrr: users.reduce((sum, item) => sum + item.monthlyValue, 0),
    freeUsers: users.filter(item => (item.subscription?.plan || 'free') === 'free').length,
    analysesUsed: users.reduce((sum, item) => sum + (item.usage?.score_checks_used || 0), 0),
    generationsUsed: users.reduce((sum, item) => sum + (item.usage?.resume_generations_used || 0), 0),
  }
}
