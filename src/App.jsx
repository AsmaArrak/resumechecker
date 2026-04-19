import { useEffect, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  pdf,
} from '@react-pdf/renderer'
import { supabase } from './lib/supabase'
import { callAiBackend } from './lib/ai'
import {
  resetAdminUsage as resetAdminUsageRequest,
  updateAdminRole as updateAdminRoleRequest,
  updateAdminSubscription as updateAdminSubscriptionRequest,
  updateOwnBilling,
  updateOwnSubscription,
} from './lib/accountBackend'
import {
  compactResume,
  formatCountdown,
  formatCurrency,
  formatResetTime,
  getPlanConfig,
  normalizeArray,
  normalizeRequirementAssessments,
  sortAdminUsers,
  summarizeAdminUsers,
} from './lib/appUtils'
import AuthPage from './components/AuthPage'
import DashboardPage from './components/DashboardPage'
import AdminPage from './components/AdminPage'
import HomePage from './components/HomePage'
import WorkspacePage from './components/WorkspacePage'
import * as appStyles from './styles/appStyles'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingBottom: 22,
    paddingHorizontal: 28,
    fontSize: 9.5,
    fontFamily: 'Helvetica',
    color: '#222',
    lineHeight: 1.32,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1a0a2e',
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 3,
  },
  contact: {
    fontSize: 8.8,
    color: '#444',
  },
  section: {
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: '#1a0a2e',
    paddingBottom: 3,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1a0a2e',
  },
  paragraph: {
    fontSize: 9.4,
    lineHeight: 1.35,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  skillLabel: {
    fontSize: 9.4,
    fontWeight: 700,
  },
  skillText: {
    fontSize: 9.4,
  },
  educationEntry: {
    marginBottom: 6,
  },
  degree: {
    fontSize: 9.8,
    fontWeight: 700,
    color: '#1a0a2e',
    marginBottom: 1,
  },
  subline: {
    fontSize: 9.2,
    color: '#333',
  },
  entry: {
    marginBottom: 7,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 9.8,
    fontWeight: 700,
    color: '#1a0a2e',
    flexShrink: 1,
  },
  entryDate: {
    fontSize: 8.8,
    color: '#555',
  },
  companyLine: {
    fontSize: 9.2,
    color: '#333',
    marginBottom: 3,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingRight: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.2,
    lineHeight: 1.35,
  },
  projectName: {
    fontSize: 9.8,
    fontWeight: 700,
    color: '#1a0a2e',
    marginBottom: 3,
  },
  awardRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
})

function BulletList({ items = [] }) {
  return (
    <View style={pdfStyles.bulletList}>
      {items.map((item, index) => (
        <View key={index} style={pdfStyles.bulletRow}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function ResumePdfDocument({ resume }) {
  if (!resume) return null

  const skillRows = Object.entries(resume.technical_skills || {}).filter(
    ([, values]) => Array.isArray(values) && values.length > 0
  )

  return (
    <Document title={`${resume.name || 'Resume'}`}>
      <Page size="LETTER" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.name}>{resume.name || ''}</Text>
          <Text style={pdfStyles.title}>{resume.title || ''}</Text>
          <Text style={pdfStyles.contact}>{resume.contact || ''}</Text>
        </View>

        {resume.summary ? (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>Summary</Text>
            <Text style={pdfStyles.paragraph}>{resume.summary}</Text>
          </View>
        ) : null}

        {skillRows.length > 0 ? (
          <View style={pdfStyles.section} wrap={false}>
            <Text style={pdfStyles.sectionTitle}>Technical Skills</Text>
            {skillRows.map(([category, values]) => (
              <View key={category} style={pdfStyles.skillRow}>
                <Text style={pdfStyles.skillLabel}>
                  {category.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                </Text>
                <Text style={pdfStyles.skillText}>{values.join(', ')}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.education?.length ? (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Education</Text>
            {resume.education.map((edu, i) => (
              <View key={i} style={pdfStyles.educationEntry} wrap={false}>
                <Text style={pdfStyles.degree}>{edu.degree}</Text>
                <Text style={pdfStyles.subline}>
                  {edu.school}
                  {edu.location ? ` | ${edu.location}` : ''}
                  {edu.dates ? ` | ${edu.dates}` : ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.experience?.length ? (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp, i) => (
              <View key={i} style={pdfStyles.entry} wrap={false}>
                <View style={pdfStyles.entryHeader}>
                  <Text style={pdfStyles.entryTitle}>{exp.title}</Text>
                  <Text style={pdfStyles.entryDate}>{exp.dates}</Text>
                </View>
                <Text style={pdfStyles.companyLine}>
                  {exp.company}
                  {exp.location ? ` | ${exp.location}` : ''}
                </Text>
                <BulletList items={exp.bullets || []} />
              </View>
            ))}
          </View>
        ) : null}

        {resume.projects?.length ? (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Projects</Text>
            {resume.projects.map((project, i) => (
              <View key={i} style={pdfStyles.entry} wrap={false}>
                <Text style={pdfStyles.projectName}>
                  {project.name}
                  {project.subtitle ? ` | ${project.subtitle}` : ''}
                </Text>
                <BulletList items={project.bullets || []} />
              </View>
            ))}
          </View>
        ) : null}

        {resume.awards?.length ? (
          <View style={pdfStyles.section}>
            <Text style={pdfStyles.sectionTitle}>Awards and Recognition</Text>
            {resume.awards.map((award, i) => (
              <View key={i} style={pdfStyles.awardRow} wrap={false}>
                <Text style={pdfStyles.bulletDot}>•</Text>
                <Text style={pdfStyles.bulletText}>{award}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  )
}

function BrandMark({ size = 20 }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      style={{ width: size * 3, height: size * 3, objectFit: 'contain', display: 'block' }}
    />
  )
}

function FeatureList({ items, dark = false }) {
  return (
    <div style={featureListStyle}>
      {items.map(item => (
        <div
          key={item.title}
          style={{
            ...featureItemStyle,
            ...(dark ? featureItemDarkStyle : null),
          }}
        >
          <div style={featureTextGroupStyle}>
            <div
              style={{
                ...featureTitleStyle,
                ...(dark ? featureTitleDarkStyle : null),
              }}
            >
              {item.title}
            </div>
            <div
              style={{
                ...featureDescriptionStyle,
                ...(dark ? featureDescriptionDarkStyle : null),
              }}
            >
              {item.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const testimonials = [
  {
    quote:
      'I used RoleMatcher to compare my resume against a frontend role I really wanted. It pointed out the missing keywords and helped me tighten the language without making it sound fake. I updated the resume that night and got 2 interview requests in the same week.',
    name: 'Maya Reynolds',
    role: 'Frontend Developer',
    meta: 'Posted on LinkedIn',
    stats: '418 likes · 37 comments',
    avatar: 'https://i.pravatar.cc/96?img=32',
  },
  {
    quote:
      'I stopped guessing what recruiters wanted. The job-description matching made my resume feel targeted instead of generic, and the resume rewrite suggestions were actually useful. After using it for 3 applications, I finally started hearing back.',
    name: 'Jordan Tran',
    role: 'Data Analyst',
    meta: 'Posted on LinkedIn',
    stats: '286 likes · 21 comments',
    avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    quote:
      'The recommendations were specific enough that I could act on them immediately. I used the optimized version for three product design applications, downloaded the final resume, and landed an offer less than a month later.',
    name: 'Nina Khatri',
    role: 'Product Designer',
    meta: 'Posted on LinkedIn',
    stats: '503 likes · 44 comments',
    avatar: 'https://i.pravatar.cc/96?img=47',
  },
]

const landingStats = [
  { value: '28+', label: 'People using RoleMatcher' },
  { value: '256+', label: 'CVs generated and refined' },
  { value: '15+', label: 'Premium users' },
]

const demoJobDescriptionLines = [
  'Frontend Engineer, SaaS Growth Team',
  'Build accessible React interfaces and reusable design-system components.',
  'Collaborate with product, design, and analytics to ship experiments.',
  'Need: React, TypeScript, metrics-driven thinking, and strong communication.',
]

const demoResumeHighlights = [
  '2+ years shipping React and TypeScript features for customer-facing products.',
  'Built a component library and improved accessibility across key flows.',
  'Partnered with PM and design on onboarding experiments and activation metrics.',
]

const demoRequirementChecks = [
  { label: 'React + TypeScript', verdict: 'Met', tone: 'strong' },
  { label: 'Accessibility', verdict: 'Met', tone: 'strong' },
  { label: 'Experimentation', verdict: 'Partial', tone: 'medium' },
  { label: 'Analytics ownership', verdict: 'Partial', tone: 'medium' },
]

const demoStepContent = [
  {
    eyebrow: 'Step 1',
    title: 'Paste a real job description',
    detail: 'RoleMatcher starts by pulling out the concrete requirements recruiters actually care about.',
  },
  {
    eyebrow: 'Step 2',
    title: 'Upload your resume',
    detail: 'Your current resume is compared against those requirements line by line instead of vague keyword matching.',
  },
  {
    eyebrow: 'Step 3',
    title: 'Get a structured fit score',
    detail: 'The match score, requirement checks, and strongest gaps appear in a decision-ready review.',
  },
]

const authBenefitItems = [
  {
    title: '100% free beta access',
    description: 'Run resume scoring while RoleMatcher is still fully free for early users.',
  },
  {
    title: 'Secure sign-in',
    description: 'Email and password accounts are handled through Supabase Auth.',
  },
  {
    title: 'Saved profile record',
    description: 'Keep your personal details in one place for future sessions.',
  },
  {
    title: 'Ready for billing later',
    description: 'The account system already supports a clean upgrade path when needed.',
  },
]

const freePlanItems = [
  {
    title: '2 score checks every 24 hours',
    description: 'Enough to test early applications and compare a few roles.',
  },
  {
    title: '2 resume generations',
    description: 'Rewrite and tailor a limited number of resumes each day.',
  },
  {
    title: 'Resume download included',
    description: 'Download the polished PDF even on the free plan.',
  },
  {
    title: 'Structured targeted feedback',
    description: 'See requirement-based analysis instead of a vague fit score.',
  },
]

const plusPlanItems = [
  {
    title: '12 score checks every 24 hours',
    description: 'Built for active job seekers applying to several roles each day.',
  },
  {
    title: '12 resume generations every 24 hours',
    description: 'Generate tailored versions without running out after a few attempts.',
  },
  {
    title: 'Resume download included',
    description: 'Export the polished version once your paid plan is active.',
  },
  {
    title: 'Higher daily usage cap',
    description: 'A stronger plan for users applying to more roles every day.',
  },
]

const proPlanItems = [
  {
    title: '20 score checks every 24 hours',
    description: 'Designed for broad, high-volume application pushes.',
  },
  {
    title: '20 resume generations every 24 hours',
    description: 'Keep tailoring resumes across many job descriptions each day.',
  },
  {
    title: 'Resume download included',
    description: 'Download polished resumes as part of the top paid plan.',
  },
  {
    title: 'Best for heavy job search volume',
    description: 'The highest daily cap for users applying aggressively.',
  },
]

const faqItems = [
  {
    question: 'Is RoleMatcher really 100% free right now?',
    answer:
      'Yes. The current beta is 100% free, so users can create an account, access the workspace, and try the analysis flow without paying.',
  },
  {
    question: 'Do I need an account before uploading my resume?',
    answer:
      'No. Visitors can open the workspace and upload their CV first. We only ask them to sign in or create an account when they press analyze.',
  },
  {
    question: 'How does the score actually work?',
    answer:
      'RoleMatcher reads the job description first, extracts the key requirements, and then checks the resume against those requirements using explicit evidence instead of random scoring.',
  },
  {
    question: 'Will RoleMatcher invent experience in my resume?',
    answer:
      'No. The optimization flow is designed to stay truthful, preserve the original experience, and improve wording without fabricating skills or achievements.',
  },
  {
    question: 'Can I use it for different roles and industries?',
    answer:
      'Yes. The scoring is tied to the specific job description you paste in, so the review adapts to each role instead of using one generic template.',
  },
]

function CountUpValue({ value, duration = 1400 }) {
  const numericTarget = Number(String(value).replace(/[^0-9]/g, '')) || 0
  const suffix = String(value).replace(/[0-9,]/g, '')
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let frameId = 0
    const start = performance.now()

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(numericTarget * eased))

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => window.cancelAnimationFrame(frameId)
  }, [duration, numericTarget])

  return `${displayValue.toLocaleString()}${suffix}`
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [enhancedResume, setEnhancedResume] = useState(null)
  const [enhancing, setEnhancing] = useState(false)
  const [enhanceError, setEnhanceError] = useState('')
  const [savingPdf, setSavingPdf] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [session, setSession] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authMode, setAuthMode] = useState('signin')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [dashboardTab, setDashboardTab] = useState('personal')
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    title: '',
    location: '',
    company: '',
  })
  const [billingForm, setBillingForm] = useState({
    billing_email: '',
    payment_method: '',
  })
  const [subscription, setSubscription] = useState(null)
  const [subscriptionNow, setSubscriptionNow] = useState(Date.now())
  const [subscriptionTimer, setSubscriptionTimer] = useState({
    endsAt: null,
    pausedRemainingMs: null,
  })
  const [demoStep, setDemoStep] = useState(0)
  const [postAuthPage, setPostAuthPage] = useState('dashboard')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [usageStatus, setUsageStatus] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminUsers, setAdminUsers] = useState([])
  const [adminSummary, setAdminSummary] = useState({
    totalUsers: 0,
    activePro: 0,
    pausedPro: 0,
    projectedMrr: 0,
    freeUsers: 0,
    analysesUsed: 0,
    generationsUsed: 0,
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial(current => (current + 1) % testimonials.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDemoStep(current => (current + 1) % demoStepContent.length)
    }, 2800)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSubscriptionNow(Date.now())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!authNotice) return undefined

    const timer = window.setTimeout(() => {
      setAuthNotice('')
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [authNotice])

  useEffect(() => {
    let mounted = true

    async function bootstrapAuth() {
      const { data, error: sessionError } = await supabase.auth.getSession()

      if (!mounted) return

      if (sessionError) {
        setAuthError(sessionError.message)
        return
      }

      setSession(data.session)
      setCurrentUser(data.session?.user ?? null)
    }

    bootstrapAuth()

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return
      setSession(nextSession)
      setCurrentUser(nextSession?.user ?? null)
      if (!nextSession?.user) {
        setProfile(null)
        setSubscription(null)
        setUsageStatus(null)
        setIsAdmin(false)
        setAdminUsers([])
      }
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!currentUser) return

    async function fetchProfile() {
      setProfileLoading(true)

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (profileError) {
        setAuthNotice(profileError.message)
        setProfileLoading(false)
        return
      }

      const fallbackProfile = {
        id: currentUser.id,
        email: currentUser.email || '',
        full_name: currentUser.user_metadata?.full_name || '',
        title: '',
        location: '',
        company: '',
      }

      const nextProfile = data || fallbackProfile
      setProfile(nextProfile)
      setProfileForm({
        full_name: nextProfile.full_name || '',
        email: nextProfile.email || currentUser.email || '',
        title: nextProfile.title || '',
        location: nextProfile.location || '',
        company: nextProfile.company || '',
      })

      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      setSubscription(subscriptionData || null)
      setIsAdmin(roleData?.role === 'admin')
      setBillingForm({
        billing_email: subscriptionData?.billing_email || nextProfile.email || currentUser.email || '',
        payment_method: subscriptionData?.provider || '',
      })
      setProfileLoading(false)
    }

    fetchProfile()
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) {
      setUsageStatus(null)
      return
    }

    refreshUsageStatus()
  }, [currentUser, subscription?.plan, subscription?.status])

  useEffect(() => {
    if (!currentUser || !isAdmin) {
      setAdminUsers([])
      setAdminSummary({
        totalUsers: 0,
        activePro: 0,
        pausedPro: 0,
        projectedMrr: 0,
        freeUsers: 0,
        analysesUsed: 0,
        generationsUsed: 0,
      })
      return
    }

    refreshAdminDashboard()
  }, [currentUser, isAdmin])

  useEffect(() => {
    if (!subscription) {
      setSubscriptionTimer({
        endsAt: null,
        pausedRemainingMs: null,
      })
      return
    }

    setSubscriptionTimer(current => {
      if (subscription.status === 'paused') {
        return current
      }

      return {
        endsAt: subscription.current_period_end
          ? new Date(subscription.current_period_end).getTime()
          : null,
        pausedRemainingMs: null,
      }
    })
  }, [subscription])

  const currentPlanKey = subscription?.plan || 'free'
  const currentPlanConfig = getPlanConfig(currentPlanKey)
  const isFreePlan = currentPlanKey === 'free'
  const isPlusPlan = currentPlanKey === 'plus'
  const isProPlan = currentPlanKey === 'pro'
  const isPaidPlan = currentPlanKey === 'plus' || currentPlanKey === 'pro'
  const isPausedPlan = subscription?.status === 'paused'
  const canActivatePlus = !isPlusPlan
  const canActivatePro = !isProPlan
  const canSwitchToFree = !isFreePlan
  const canPauseSubscription = isPaidPlan && !isPausedPlan
  const canResumeSubscription = isPaidPlan && isPausedPlan

  const subscriptionRemainingMs =
    subscription?.status === 'paused'
      ? subscriptionTimer.pausedRemainingMs || 0
      : subscriptionTimer.endsAt
        ? Math.max(subscriptionTimer.endsAt - subscriptionNow, 0)
        : 0

  const subscriptionCountdownLabel =
    isPaidPlan ? formatCountdown(subscriptionRemainingMs) : 'No active paid cycle'

  const subscriptionStatusLabel =
    subscription?.status === 'paused'
      ? 'Paused'
      : subscription?.status === 'active'
        ? 'Active'
        : subscription?.status || 'free'

  const subscriptionRenewalLabel =
    subscription?.status === 'paused'
      ? 'Timer is paused'
      : subscription?.current_period_end
        ? new Date(subscription.current_period_end).toLocaleString()
        : 'Not scheduled'

  const usageResetLabel = usageStatus?.reset_at ? formatResetTime(usageStatus.reset_at) : ''

  async function refreshUsageStatus() {
    if (!currentUser) return

    const { data, error: usageError } = await supabase.rpc('get_usage_status')

    if (usageError) {
      setAuthNotice(usageError.message)
      return
    }

    const usageRow = Array.isArray(data) ? data[0] : data
    setUsageStatus(usageRow || null)
  }

  async function refreshAdminDashboard() {
    if (!currentUser || !isAdmin) return

    setAdminLoading(true)

    const [profilesResult, subscriptionsResult, usageResult, rolesResult] = await Promise.all([
      supabase.from('profiles').select('id, email, full_name, title, location, company, created_at'),
      supabase
        .from('subscriptions')
        .select('user_id, plan, status, billing_email, provider, current_period_end, auto_renew, updated_at'),
      supabase
        .from('usage_windows')
        .select('user_id, window_start, score_checks_used, resume_generations_used, updated_at'),
      supabase.from('user_roles').select('user_id, role'),
    ])

    const firstError =
      profilesResult.error || subscriptionsResult.error || usageResult.error || rolesResult.error

    if (firstError) {
      setAdminLoading(false)
      setAuthNotice(firstError.message)
      return
    }

    const subscriptionMap = new Map((subscriptionsResult.data || []).map(item => [item.user_id, item]))
    const usageMap = new Map((usageResult.data || []).map(item => [item.user_id, item]))
    const roleMap = new Map((rolesResult.data || []).map(item => [item.user_id, item.role]))

    const mergedUsers = sortAdminUsers((profilesResult.data || [])
      .map(item => {
        const subscriptionRow = subscriptionMap.get(item.id) || null
        const usageRow = usageMap.get(item.id) || null
        const role = roleMap.get(item.id) || 'user'
        const isActivePaid =
          (subscriptionRow?.plan === 'plus' || subscriptionRow?.plan === 'pro') &&
          subscriptionRow?.status === 'active'
        const monthlyValue = isActivePaid ? getPlanConfig(subscriptionRow?.plan).monthlyPrice : 0

        return {
          ...item,
          role,
          subscription: subscriptionRow,
          usage: usageRow,
          monthlyValue,
        }
      }))

    setAdminUsers(mergedUsers)
    setAdminSummary(summarizeAdminUsers(mergedUsers))
    setAdminLoading(false)
  }

  async function consumeUsageAttempt(actionName) {
    const { data, error: usageError } = await supabase.rpc('consume_usage_attempt', {
      action_name: actionName,
    })

    if (usageError) {
      throw new Error(usageError.message)
    }

    const usageRow = Array.isArray(data) ? data[0] : data
    if (!usageRow) {
      throw new Error('Unable to verify usage limits right now.')
    }

    setUsageStatus(usageRow)

    if (!usageRow.allowed) {
      const resetText = usageRow.reset_at ? ` Resets ${formatResetTime(usageRow.reset_at)}.` : ''
      throw new Error(`${usageRow.message}${resetText}`)
    }

    return usageRow
  }

  async function updateAdminSubscription(user, nextFields, successMessage) {
    if (!isAdmin || !user) return

    setAdminLoading(true)
    const baseSubscription = user.subscription || {
      billing_email: user.email || '',
      provider: 'manual',
      plan: 'free',
      status: 'free',
      auto_renew: false,
      current_period_end: null,
    }

    const payload = {
      ...baseSubscription,
      userId: user.id,
      ...nextFields,
    }

    try {
      const data = await updateAdminSubscriptionRequest(payload)
      const updatedAdminUsers = sortAdminUsers(
        adminUsers.map(item => {
          if (item.id !== user.id) return item

          const nextSubscription = data.subscription
          const isActivePaid =
            (nextSubscription?.plan === 'plus' || nextSubscription?.plan === 'pro') &&
            nextSubscription?.status === 'active'

          return {
            ...item,
            subscription: nextSubscription,
            monthlyValue: isActivePaid ? getPlanConfig(nextSubscription?.plan).monthlyPrice : 0,
          }
        })
      )

      setAdminUsers(updatedAdminUsers)
      setAdminSummary(summarizeAdminUsers(updatedAdminUsers))

      if (currentUser?.id === user.id) {
        setSubscription(data.subscription)
      }
      await refreshAdminDashboard()
      if (currentUser?.id === user.id) {
        await refreshUsageStatus()
      }
      setAdminLoading(false)
      setAuthNotice(successMessage)
    } catch (updateError) {
      setAdminLoading(false)
      setAuthNotice(updateError.message)
      return
    }
  }

  async function resetAdminUsage(user) {
    if (!isAdmin || !user) return

    setAdminLoading(true)
    try {
      await resetAdminUsageRequest({ userId: user.id })
      await refreshAdminDashboard()
      if (currentUser?.id === user.id) {
        await refreshUsageStatus()
      }
      setAdminLoading(false)
      setAuthNotice(`Usage reset for ${user.full_name || user.email}.`)
    } catch (resetError) {
      setAdminLoading(false)
      setAuthNotice(resetError.message)
      return
    }
  }

  async function updateAdminRole(user, nextRole) {
    if (!isAdmin || !user) return

    setAdminLoading(true)
    try {
      await updateAdminRoleRequest({ userId: user.id, role: nextRole })
      if (currentUser?.id === user.id) {
        setIsAdmin(nextRole === 'admin')
      }
      await refreshAdminDashboard()
      setAdminLoading(false)
      setAuthNotice(`${user.full_name || user.email} is now ${nextRole}.`)
    } catch (roleError) {
      setAdminLoading(false)
      setAuthNotice(roleError.message)
      return
    }
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    setFileName(file.name)
    setError('')
    setEnhanceError('')
    setResult(null)
    setEnhancedResume(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let text = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        text += content.items.map(item => item.str).join(' ') + '\n'
      }

      setResumeText(text.trim())
    } catch (err) {
      setError(`Failed to read PDF: ${err.message}`)
    }
  }

  async function analyze() {
    if (!currentUser) {
      setAuthNotice('Create a free account or sign in to run your resume analysis.')
      setPostAuthPage('workspace')
      openAuth('signin')
      return
    }

    if (!jobDescription.trim() || !resumeText) return

    setLoading(true)
    setError('')
    setResult(null)
    setEnhancedResume(null)

    try {
      await consumeUsageAttempt('analysis')

      const parsed = await callAiBackend(
        [
          {
            role: 'system',
            content:
              'You are a rigorous ATS resume evaluator. Judge resumes against the job description using explicit evidence from the resume, not vibes or keyword stuffing. Return valid JSON only. No markdown. No backticks. No commentary.',
          },
          {
            role: 'user',
            content: `Evaluate how well the resume fits the job description.

ANALYSIS METHOD:
1. Extract the most important role requirements from the job description.
2. Classify each requirement as "must-have" or "preferred".
3. Mark each requirement as "met", "partial", or "missing" based only on direct evidence in the resume.
4. Use those findings to calculate the final score. Do not invent evidence. Do not give credit for vague similarity alone.

SCORING RULES:
- hard_requirements_score: 0-45
- relevant_experience_score: 0-25
- achievements_score: 0-20
- preferred_qualifications_score: 0-10
- match_score must equal the sum

IMPORTANT:
- Prioritize must-have requirements over nice-to-have items.
- Only count skills or qualifications as matched if they are explicitly stated or strongly supported by the resume.
- Missing skills should come from the job description and be genuinely absent or weakly supported.
- Do not reward generic buzzwords, self-descriptions, or filler language unless backed by concrete experience.
- Reward quantified outcomes, ownership, scope, and relevant tool/domain alignment.
- Do not over-penalize wording differences when the same capability is clearly demonstrated.
- summary must be 1 sentence, maximum 24 words.
- percentile should be a cautious estimate based on fit strength, not a random claim.
- recommendations must contain exactly 3 items.
- requirements_assessment must contain 4 to 8 items.

Return ONLY this JSON structure:
{
  "match_score": 0,
  "score_breakdown": {
    "hard_requirements_score": 0,
    "relevant_experience_score": 0,
    "achievements_score": 0,
    "preferred_qualifications_score": 0
  },
  "score_label": "Strong match",
  "percentile": "Top 25%",
  "summary": "string",
  "matched_skills": ["string"],
  "missing_skills": ["string"],
  "critical_gaps": ["string"],
  "requirements_assessment": [
    {
      "requirement": "string",
      "priority": "must-have",
      "verdict": "met",
      "evidence": "string"
    }
  ],
  "recommendations": ["string", "string", "string"]
}

RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`,
          },
        ],
        1200
      )

      setResult({
        match_score: parsed.match_score ?? 0,
        score_breakdown: {
          hard_requirements_score: parsed.score_breakdown?.hard_requirements_score ?? 0,
          relevant_experience_score: parsed.score_breakdown?.relevant_experience_score ?? 0,
          achievements_score: parsed.score_breakdown?.achievements_score ?? 0,
          preferred_qualifications_score: parsed.score_breakdown?.preferred_qualifications_score ?? 0,
        },
        score_label: parsed.score_label || 'Partial match',
        percentile: parsed.percentile || '',
        summary: parsed.summary || '',
        matched_skills: Array.isArray(parsed.matched_skills) ? parsed.matched_skills : [],
        missing_skills: Array.isArray(parsed.missing_skills) ? parsed.missing_skills : [],
        critical_gaps: Array.isArray(parsed.critical_gaps) ? parsed.critical_gaps.slice(0, 4) : [],
        requirements_assessment: normalizeRequirementAssessments(parsed.requirements_assessment),
        recommendations:
          Array.isArray(parsed.recommendations) && parsed.recommendations.length
            ? parsed.recommendations.slice(0, 3)
            : [],
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function generateResume() {
    if (!currentUser) {
      setAuthNotice('Create a free account or sign in to generate a tailored resume.')
      setPostAuthPage('workspace')
      openAuth('signin')
      return
    }

    if (!result) return

    setEnhancing(true)
    setEnhanceError('')
    setEnhancedResume(null)

    try {
      await consumeUsageAttempt('generation')

      const parsed = await callAiBackend(
        [
          {
            role: 'system',
            content:
              'You are an expert ATS resume editor. Preserve the original resume and make the smallest truthful improvements needed to better match the job description. Never invent facts. Never replace correct original content with weaker paraphrases. Add missing relevant details only when clearly supported by the original resume. Return valid JSON only.',
          },
          {
            role: 'user',
            content: `You are improving a resume for a target job description.

VERY IMPORTANT GOAL:
Do NOT override the candidate's original resume content unnecessarily.
Keep the original structure, facts, roles, projects, and skills.
Only strengthen wording, align terminology to the job description, and add missing relevant keywords/details when they are already supported by the original resume.

PAGE LENGTH RULES:
- Target a maximum of 2 pages in a standard US Letter PDF resume.
- Be concise.
- Keep summary to 2-3 sentences maximum.
- Keep technical skills compact and avoid repeating tools across categories.
- For each experience entry, return 2-3 bullets maximum unless the role is highly relevant.
- For each project, return 1-2 bullets maximum.
- Include only the 3 most relevant real projects for the target job description.
- Keep awards concise.
- Prioritize the most job-relevant content first.
- If space is tight, shorten bullets instead of adding more sections.

This means:
- Preserve original experience, education, projects, skills, and awards.
- Keep the same meaning of the original bullets.
- Do not delete strong original content unless it is redundant.
- Do not rewrite everything from scratch.
- Make minimal but high-value improvements.
- Follow the job description closely, but stay fully truthful.

The output MUST follow this exact section structure and order:
1. name
2. title
3. contact
4. summary
5. technical_skills
6. education
7. experience
8. projects
9. awards

CRITICAL RULES:
- Do NOT invent jobs, degrees, projects, companies, certifications, tools, awards, metrics, teams, or achievements.
- Do NOT fabricate years of experience or numbers.
- Only add keywords from the job description if they are truly supported by the original resume.
- If a missing keyword is not supported, leave it out.
- Preserve chronology.
- Preserve the candidate's original strengths.
- Keep wording ATS-friendly and aligned to the job description.
- Experience and project bullets should be polished, concise, and recruiter-friendly.
- Prefer minimal enhancement over full rewriting.

HOW TO EDIT:
- Summary: tailor to the target role using real strengths from the original resume.
- Technical skills: keep the original categories and add only truthful missing terms already supported.
- Experience: keep the original role scope and bullet meaning; improve action verbs and align wording to the job description.
- Projects: preserve original project names and core descriptions; only sharpen wording and add relevant truthful keywords.
- Awards: keep real awards only.

INPUTS:

ORIGINAL RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

MISSING KEYWORDS FROM ANALYSIS:
${(result.missing_skills || []).join(', ')}

Return ONLY this exact JSON structure:
{
  "name": "string",
  "title": "string",
  "contact": "string",
  "summary": "string",
  "technical_skills": {
    "Languages": ["string"],
    "Frontend": ["string"],
    "Backend": ["string"],
    "Databases": ["string"],
    "DevOpsAndTools": ["string"],
    "CloudPlatforms": ["string"],
    "DesignAndPM": ["string"]
  },
  "education": [
    {
      "degree": "string",
      "school": "string",
      "location": "string",
      "dates": "string"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "dates": "string",
      "bullets": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "subtitle": "string",
      "bullets": ["string"]
    }
  ],
  "awards": ["string"]
}`,
          },
        ],
        2400
      )

      setEnhancedResume(compactResume(parsed))
    } catch (err) {
      setEnhanceError(err.message)
    } finally {
      setEnhancing(false)
    }
  }

  async function handleDownloadPdf() {
    if (!enhancedResume) return

    try {
      setSavingPdf(true)
      const blob = await pdf(<ResumePdfDocument resume={enhancedResume} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(enhancedResume.name || 'resume').replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setEnhanceError(`Failed to download PDF: ${err.message}`)
    } finally {
      setSavingPdf(false)
    }
  }

  const canRun = jobDescription.trim() && resumeText && !loading
  const currentTestimonial = testimonials[activeTestimonial]
  const pageStyles = {
    accountSectionStyle,
    accountHeroStyle,
    sectionEyebrowStyle,
    sectionHeadingDarkStyle,
    workspaceNoteStyle,
    authLayoutStyle,
    authPanelStyle,
    authTabsStyle,
    authTabStyle,
    authTabActiveStyle,
    authFormStyle,
    fieldShellStyle,
    fieldLabelStyle,
    textInputStyle,
    errorBoxStyle,
    primaryButtonStyle,
    primaryButtonDisabledStyle,
    authBenefitsStyle,
    authBenefitsHeaderStyle,
    cardLabelStyle,
    authBenefitsTitleStyle,
    authBenefitsBadgeStyle,
    authBenefitsLeadStyle,
    dashboardTabsStyle,
    dashboardTabStyle,
    dashboardTabActiveStyle,
    dashboardSignOutStyle,
    dashboardCardStyle,
    dashboardFieldsStyle,
    dashboardButtonRowStyle,
    primaryButtonInlineStyle,
    secondaryInlineButtonStyle,
    secondaryInlineButtonDisabledStyle,
    subscriptionSummaryStyle,
    subscriptionPlanStyle,
    subscriptionMetaStyle,
    subscriptionChipStyle,
    subscriptionTimerCardStyle,
    subscriptionTimerValueStyle,
    subscriptionTimerMetaStyle,
    adminSummaryGridStyle,
    adminSummaryCardStyle,
    adminSummaryValueStyle,
    adminSummaryMetaStyle,
    adminHeaderRowStyle,
    adminTableStyle,
    adminTableHeaderStyle,
    adminRowStyle,
    adminUserCellStyle,
    adminUserNameStyle,
    adminUserMetaStyle,
    adminPillStyle,
    adminDetailCellStyle,
    adminDetailStrongStyle,
    adminActionsCellStyle,
  }

  function openAuth(mode = 'signin') {
    setAuthMode(mode)
    setAuthError('')
    setCurrentPage('auth')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openWorkspace() {
    setCurrentPage('workspace')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    setCurrentPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openDashboard() {
    if (!currentUser) {
      openAuth('signin')
      return
    }

    setCurrentPage('dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openAdmin() {
    if (!currentUser) {
      openAuth('signin')
      return
    }

    if (!isAdmin) {
      setAuthNotice('This account does not have admin access.')
      return
    }

    setCurrentPage('admin')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleAuthFieldChange(field, value) {
    setAuthForm(current => ({ ...current, [field]: value }))
  }

  async function handleCreateAccount(event) {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthNotice('')

    const normalizedEmail = authForm.email.trim().toLowerCase()

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: authForm.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: authForm.name.trim(),
        },
      },
    })

    setAuthLoading(false)

    if (signUpError) {
      setAuthError(signUpError.message)
      return
    }

    if (!signUpData?.user || signUpData.user.identities?.length === 0) {
      setAuthError('An account with this email already exists. Sign in instead.')
      setAuthMode('signin')
      setAuthForm(current => ({ ...current, email: normalizedEmail, password: '' }))
      return
    }

    setAuthNotice('Account created. Check your email to confirm your address before signing in.')
    setAuthMode('signin')
    setAuthForm(current => ({ ...current, email: normalizedEmail, password: '' }))
  }

  async function handleSignIn(event) {
    event.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    setAuthNotice('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authForm.email.trim(),
      password: authForm.password,
    })

    setAuthLoading(false)

    if (signInError) {
      setAuthError(signInError.message)
      return
    }

    setCurrentPage(postAuthPage || 'dashboard')
    setAuthNotice('Signed in successfully.')
  }

  async function handleSignOut() {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setAuthError(signOutError.message)
      return
    }

    setCurrentPage('home')
    setAuthNotice('Signed out.')
  }

  async function handleProfileSave(event) {
    event.preventDefault()
    if (!currentUser) return

    setProfileLoading(true)
    setAuthNotice('')

    const nextName = profileForm.full_name.trim()

    if (nextName !== (currentUser.user_metadata?.full_name || '')) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          full_name: nextName,
        },
      })

      if (updateAuthError) {
        setProfileLoading(false)
        setAuthNotice(updateAuthError.message)
        return
      }
    }

    const payload = {
      id: currentUser.id,
      email: currentUser.email || profileForm.email.trim().toLowerCase(),
      full_name: nextName,
      title: profileForm.title.trim(),
      location: profileForm.location.trim(),
      company: profileForm.company.trim(),
    }

    const { data, error: upsertError } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single()

    setProfileLoading(false)

    if (upsertError) {
      setAuthNotice(upsertError.message)
      return
    }

    setProfile(data)
    setAuthNotice('Profile updated.')
  }

  async function handleBillingSave(event) {
    event.preventDefault()
    if (!currentUser) return

    setProfileLoading(true)

    const payload = {
      billing_email: billingForm.billing_email.trim(),
      provider: billingForm.payment_method.trim() || 'manual',
    }

    try {
      const data = await updateOwnBilling(payload)
      setProfileLoading(false)
      setSubscription(data.subscription)
      setAuthNotice('Billing details updated.')
    } catch (billingError) {
      setProfileLoading(false)
      setAuthNotice(billingError.message)
      return
    }
  }

  async function updateSubscriptionState(nextFields, successMessage, timerUpdate) {
    if (!currentUser) return

    setProfileLoading(true)

    const payload = {
      billing_email: billingForm.billing_email.trim() || currentUser.email || '',
      provider: billingForm.payment_method.trim() || subscription?.provider || 'manual',
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'free',
      auto_renew: subscription?.auto_renew || false,
      current_period_end: subscription?.current_period_end || null,
      ...nextFields,
    }

    try {
      const data = await updateOwnSubscription(payload)
      setProfileLoading(false)
      setSubscription(data.subscription)
      if (timerUpdate) {
        setSubscriptionTimer(current => ({
          ...current,
          ...timerUpdate,
        }))
      }
      setAuthNotice(successMessage)
    } catch (subscriptionError) {
      setProfileLoading(false)
      setAuthNotice(subscriptionError.message)
      return
    }
  }

  async function handleActivatePaidPlan(planKey) {
    const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    const planLabel = getPlanConfig(planKey).label

    await updateSubscriptionState(
      { plan: planKey, status: 'active', auto_renew: true, current_period_end: endsAt },
      `${planLabel} activated.`,
      { endsAt: new Date(endsAt).getTime(), pausedRemainingMs: null }
    )
  }

  async function handlePauseSubscription() {
    if (!isPaidPlan) {
      setAuthNotice('Activate Plus or Pro before pausing the subscription timer.')
      return
    }

    const remainingMs =
      subscription?.status === 'paused'
        ? subscriptionTimer.pausedRemainingMs || 0
        : subscriptionTimer.endsAt
          ? Math.max(subscriptionTimer.endsAt - Date.now(), 0)
          : 0

    await updateSubscriptionState(
      { status: 'paused', auto_renew: false },
      `${currentPlanConfig.label} paused.`,
      { pausedRemainingMs: remainingMs }
    )
  }

  async function handleResumeSubscription() {
    const remainingMs = subscriptionTimer.pausedRemainingMs || 0

    if (!remainingMs) {
      setAuthNotice('There is no paused paid-plan time to resume.')
      return
    }

    const endsAt = new Date(Date.now() + remainingMs).toISOString()

    await updateSubscriptionState(
      { plan: currentPlanKey, status: 'active', auto_renew: true, current_period_end: endsAt },
      `${currentPlanConfig.label} resumed.`,
      { endsAt: new Date(endsAt).getTime(), pausedRemainingMs: null }
    )
  }

  async function handleFreePlan() {
    await updateSubscriptionState(
      { plan: 'free', status: 'free', auto_renew: false, current_period_end: null },
      'Switched to the free plan.',
      { endsAt: null, pausedRemainingMs: null }
    )
  }

  async function handleCancelSubscription() {
    await updateSubscriptionState(
      { plan: 'free', status: 'free', auto_renew: false, current_period_end: null },
      'Subscription canceled. Your account is back on the free plan.',
      { endsAt: null, pausedRemainingMs: null }
    )
  }

  function openConfirmDialog(config) {
    setConfirmDialog(config)
  }

  function closeConfirmDialog() {
    if (profileLoading) return
    setConfirmDialog(null)
  }

  async function handleConfirmAction() {
    if (!confirmDialog?.onConfirm) return

    await confirmDialog.onConfirm()
    setConfirmDialog(null)
  }

  const sharedStyles = {
    accountSectionStyle,
    accountHeroStyle,
    sectionEyebrowStyle,
    sectionHeadingDarkStyle,
    workspaceNoteStyle,
    authLayoutStyle,
    authPanelStyle,
    authTabsStyle,
    authTabActiveStyle,
    authTabStyle,
    authFormStyle,
    fieldShellStyle,
    fieldLabelStyle,
    textInputStyle,
    errorBoxStyle,
    primaryButtonStyle,
    primaryButtonDisabledStyle,
    primaryButtonInlineStyle,
    secondaryInlineButtonStyle,
    secondaryInlineButtonDisabledStyle,
    dashboardTabsStyle,
    dashboardTabActiveStyle,
    dashboardTabStyle,
    dashboardSignOutStyle,
    dashboardCardStyle,
    dashboardFieldsStyle,
    dashboardButtonRowStyle,
    cardLabelStyle,
    subscriptionSummaryStyle,
    subscriptionPlanStyle,
    subscriptionMetaStyle,
    subscriptionChipStyle,
    subscriptionTimerCardStyle,
    subscriptionTimerValueStyle,
    subscriptionTimerMetaStyle,
    authBenefitsStyle,
    authBenefitsHeaderStyle,
    authBenefitsTitleStyle,
    authBenefitsBadgeStyle,
    authBenefitsLeadStyle,
    adminSummaryGridStyle,
    adminSummaryCardStyle,
    adminSummaryValueStyle,
    adminSummaryMetaStyle,
    adminHeaderRowStyle,
    adminTableStyle,
    adminTableHeaderStyle,
    adminRowStyle,
    adminUserCellStyle,
    adminUserNameStyle,
    adminUserMetaStyle,
    adminPillStyle,
    adminDetailCellStyle,
    adminDetailStrongStyle,
    adminActionsCellStyle,
  }

  const pageShellStyle =
    currentPage === 'home'
      ? appShellStyle
      : {
          ...appShellStyle,
          background: 'linear-gradient(180deg, #f5f2ff 0%, #f7f4ff 100%)',
        }

  return (
    <div style={pageShellStyle}>
      <nav style={navStyle}>
        <button
          type="button"
          onClick={goHome}
          style={brandButtonStyle}
          aria-label="Go to RoleMatcher home"
          title="Go to RoleMatcher home"
        >
          <div style={logoIconStyle}>
            <BrandMark size={22} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
              RoleMatcher
            </div>
            <div style={{ fontSize: 11, color: '#bdb6ff', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              100% Free Resume Match
            </div>
          </div>
        </button>
        <div style={headerActionsStyle}>
          <button
            type="button"
            onClick={goHome}
            style={currentPage === 'home' ? navLinkActiveStyle : navLinkStyle}
          >
            Home
          </button>
          <button
            type="button"
            onClick={openWorkspace}
            style={currentPage === 'workspace' ? navLinkActiveStyle : navLinkStyle}
          >
            Check scores
          </button>
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={openDashboard}
                style={currentPage === 'dashboard' ? navLinkActiveStyle : navLinkStyle}
              >
                Dashboard
              </button>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={openAdmin}
                  style={currentPage === 'admin' ? navLinkActiveStyle : navLinkStyle}
                >
                  Admin
                </button>
              ) : null}
              <button type="button" onClick={handleSignOut} style={navLinkStyle}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => openAuth('signin')} style={navLinkStyle}>
                Sign in
              </button>
              <button type="button" onClick={() => openAuth('create')} style={navLinkActiveStyle}>
                Create account
              </button>
            </>
          )}
          <div style={badgeStyle}>100% Free Beta</div>
        </div>
      </nav>

      {authNotice ? <div style={noticeWrapStyle}><div style={noticeBoxStyle}>{authNotice}</div></div> : null}

      {confirmDialog ? (
        <div style={confirmOverlayStyle} onClick={closeConfirmDialog}>
          <div style={confirmModalStyle} onClick={event => event.stopPropagation()}>
            <div style={confirmHeaderStyle}>
              <div style={confirmTitleStyle}>{confirmDialog.title}</div>
              <button type="button" onClick={closeConfirmDialog} style={confirmCloseStyle}>
                ×
              </button>
            </div>
            <div style={confirmBodyStyle}>{confirmDialog.message}</div>
            <div style={confirmActionsStyle}>
              <button type="button" onClick={closeConfirmDialog} style={confirmSecondaryStyle}>
                {confirmDialog.cancelLabel || 'Keep current plan'}
              </button>
              <button type="button" onClick={handleConfirmAction} style={confirmPrimaryStyle} disabled={profileLoading}>
                {profileLoading ? 'Saving...' : confirmDialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {currentPage === 'home' ? (
      <div style={heroStyle}>
        <div style={heroPanelStyle}>
          <div style={heroLayoutStyle}>
            <div>
              <div style={eyebrowStyle}>100% Free Resume Intelligence</div>
              <h1 style={heroTitleStyle}>
                Turn every resume review
                <br />
                <span style={{ color: '#C9C3FF' }}>into a hiring-grade decision</span>
              </h1>
              <p style={heroSubStyle}>
                100% free resume matching with clearer scoring, stronger JD alignment, and truthful optimization.
              </p>

              <div style={heroActionsStyle}>
                <button type="button" onClick={openWorkspace} style={primaryButtonStyle} className="hero-cta-button">
                  Let's start for free
                </button>
              </div>

              <div style={heroMetricRowStyle}>
                <div style={heroMetricStyle}>
                  <div style={heroMetricValueStyle}>Structured scoring</div>
                  <div style={heroMetricLabelStyle}>Weighted evaluation</div>
                </div>
                <div style={heroMetricStyle}>
                  <div style={heroMetricValueStyle}>Job-description matching</div>
                  <div style={heroMetricLabelStyle}>Requirement-based review</div>
                </div>
                <div style={heroMetricStyle}>
                  <div style={heroMetricValueStyle}>Truthful optimization</div>
                  <div style={heroMetricLabelStyle}>Fact-preserving improvement</div>
                </div>
              </div>
            </div>

            <div style={heroPreviewShellStyle}>
              <div style={heroPreviewTopStyle}>
                <div>
                  <div style={heroPreviewEyebrowStyle}>Live Preview</div>
                  <div style={heroPreviewTitleStyle}>RoleMatcher score</div>
                </div>
                <div style={heroPreviewStatusStyle}>Analysis complete</div>
              </div>

              <div style={heroPreviewScoreRowStyle}>
                <div style={heroPreviewScoreCardStyle}>
                  <div style={heroPreviewScoreValueStyle}>
                    {demoStep === 0 ? '64' : demoStep === 1 ? '78' : '86'}
                    <span style={heroPreviewScoreOutOfStyle}>/100</span>
                  </div>
                  <div style={heroPreviewScoreLabelStyle}>Match score</div>
                </div>

                <div style={heroPreviewBarsStyle}>
                  {demoRequirementChecks.slice(0, 3).map((item, index) => {
                    const value =
                      demoStep === 0 ? [72, 68, 59][index] : demoStep === 1 ? [84, 76, 71][index] : [93, 88, 81][index]

                    return (
                      <div key={item.label} style={heroPreviewBarRowStyle}>
                        <div style={heroPreviewBarLabelStyle}>{item.label}</div>
                        <div style={heroPreviewBarTrackStyle}>
                          <div style={{ ...heroPreviewBarFillStyle, width: `${value}%` }} />
                        </div>
                        <div style={heroPreviewBarValueStyle}>{value}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={heroPreviewTagsStyle}>
                <div style={heroPreviewTagStyle}>React</div>
                <div style={heroPreviewTagStyle}>TypeScript</div>
                <div style={heroPreviewTagStyle}>Accessibility</div>
                <div style={heroPreviewTagStyle}>JD match</div>
              </div>

              <div style={heroPreviewInsightStyle}>
                {demoStep === 0
                  ? 'Extracting the role requirements.'
                  : demoStep === 1
                    ? 'Matching resume evidence before scoring.'
                    : 'Clear fit summary with honest next steps.'}
              </div>
            </div>
          </div>
        </div>
      </div>
      ) : null}

      <main style={mainStyle}>
        <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
          {currentPage === 'auth' ? (
            <AuthPage
              authMode={authMode}
              setAuthMode={setAuthMode}
              authForm={authForm}
              handleAuthFieldChange={handleAuthFieldChange}
              handleSignIn={handleSignIn}
              handleCreateAccount={handleCreateAccount}
              authError={authError}
              authLoading={authLoading}
              styles={sharedStyles}
              FeatureList={FeatureList}
              authBenefitItems={authBenefitItems}
            />
          ) : null}

          {currentPage === 'dashboard' && currentUser ? (
            <DashboardPage
              currentUser={currentUser}
              dashboardTab={dashboardTab}
              setDashboardTab={setDashboardTab}
              handleSignOut={handleSignOut}
              handleProfileSave={handleProfileSave}
              handleBillingSave={handleBillingSave}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              billingForm={billingForm}
              setBillingForm={setBillingForm}
              profileLoading={profileLoading}
              subscription={subscription}
              subscriptionStatusLabel={subscriptionStatusLabel}
              subscriptionRenewalLabel={subscriptionRenewalLabel}
              subscriptionCountdownLabel={subscriptionCountdownLabel}
              currentPlanConfig={currentPlanConfig}
              isFreePlan={isFreePlan}
              isPaidPlan={isPaidPlan}
              canSwitchToFree={canSwitchToFree}
              canActivatePlus={canActivatePlus}
              canActivatePro={canActivatePro}
              canPauseSubscription={canPauseSubscription}
              canResumeSubscription={canResumeSubscription}
              openConfirmDialog={openConfirmDialog}
              handleFreePlan={handleFreePlan}
              handleActivatePaidPlan={handleActivatePaidPlan}
              handlePauseSubscription={handlePauseSubscription}
              handleResumeSubscription={handleResumeSubscription}
              updateSubscriptionState={updateSubscriptionState}
              styles={sharedStyles}
            />
          ) : null}

          {currentPage === 'admin' && currentUser && isAdmin ? (
            <AdminPage
              currentUser={currentUser}
              adminSummary={adminSummary}
              adminLoading={adminLoading}
              adminUsers={adminUsers}
              refreshAdminDashboard={refreshAdminDashboard}
              formatCurrency={formatCurrency}
              formatResetTime={formatResetTime}
              getPlanConfig={getPlanConfig}
              openConfirmDialog={openConfirmDialog}
              updateAdminSubscription={updateAdminSubscription}
              resetAdminUsage={resetAdminUsage}
              updateAdminRole={updateAdminRole}
              styles={sharedStyles}
            />
          ) : null}


          {currentPage === 'home' ? (
            <HomePage
              landingStats={landingStats}
              CountUpValue={CountUpValue}
              sectionEyebrowStyle={sectionEyebrowStyle}
              sectionHeadingStyle={sectionHeadingStyle}
              sectionHeadingDarkStyle={sectionHeadingDarkStyle}
              landingSectionStyle={landingSectionStyle}
              statsGridStyle={statsGridStyle}
              statCardStyle={statCardStyle}
              statValueStyle={statValueStyle}
              statLabelStyle={statLabelStyle}
              cardStyle={cardStyle}
              featureSectionStyle={featureSectionStyle}
              testimonialShellStyle={testimonialShellStyle}
              testimonialCardStyle={testimonialCardStyle}
              carouselButtonStyle={carouselButtonStyle}
              currentTestimonial={currentTestimonial}
              postHeaderStyle={postHeaderStyle}
              authorRowStyle={authorRowStyle}
              avatarStyle={avatarStyle}
              testimonialMetaStyle={testimonialMetaStyle}
              postMetaLineStyle={postMetaLineStyle}
              linkedinBadgeStyle={linkedinBadgeStyle}
              quoteMarkStyle={quoteMarkStyle}
              testimonialQuoteStyle={testimonialQuoteStyle}
              postFooterStyle={postFooterStyle}
              postStatsStyle={postStatsStyle}
              postActionsStyle={postActionsStyle}
              dotsRowStyle={dotsRowStyle}
              dotStyle={dotStyle}
              testimonials={testimonials}
              activeTestimonial={activeTestimonial}
              setActiveTestimonial={setActiveTestimonial}
              pricingCaptionStyle={pricingCaptionStyle}
              pricingGridStyle={pricingGridStyle}
              pricingCardStyle={pricingCardStyle}
              pricingTierDarkStyle={pricingTierDarkStyle}
              pricingTierStyle={pricingTierStyle}
              pricingValueStyle={pricingValueStyle}
              pricingUnitStyle={pricingUnitStyle}
              pricingSubDarkStyle={pricingSubDarkStyle}
              pricingSubStyle={pricingSubStyle}
              featuredBadgeStyle={featuredBadgeStyle}
              featuredPricingStyle={featuredPricingStyle}
              FeatureList={FeatureList}
              freePlanItems={freePlanItems}
              plusPlanItems={plusPlanItems}
              proPlanItems={proPlanItems}
              ctaPanelStyle={ctaPanelStyle}
              ctaTextWrapStyle={ctaTextWrapStyle}
              ctaSupportRowStyle={ctaSupportRowStyle}
              ctaSupportPillStyle={ctaSupportPillStyle}
              primaryButtonStyle={primaryButtonStyle}
              openWorkspace={openWorkspace}
              faqSectionStyle={faqSectionStyle}
              faqIntroStyle={faqIntroStyle}
              workspaceNoteStyle={workspaceNoteStyle}
              faqListStyle={faqListStyle}
              faqItems={faqItems}
              openFaqIndex={openFaqIndex}
              setOpenFaqIndex={setOpenFaqIndex}
              faqItemStyle={faqItemStyle}
              faqQuestionRowStyle={faqQuestionRowStyle}
              faqQuestionStyle={faqQuestionStyle}
              faqToggleStyle={faqToggleStyle}
              faqAnswerStyle={faqAnswerStyle}
            />
          ) : null}
          {currentPage === 'workspace' ? (
            <WorkspacePage
              currentUser={currentUser}
              isFreePlan={isFreePlan}
              currentPlanConfig={currentPlanConfig}
              usageResetLabel={usageResetLabel}
              usageStatus={usageStatus}
              sectionEyebrowStyle={sectionEyebrowStyle}
              sectionHeadingDarkStyle={sectionHeadingDarkStyle}
              workspaceSectionStyle={workspaceSectionStyle}
              workspaceNoteStyle={workspaceNoteStyle}
              usagePanelStyle={usagePanelStyle}
              cardLabelStyle={cardLabelStyle}
              usagePanelTitleStyle={usagePanelTitleStyle}
              usagePanelMetaStyle={usagePanelMetaStyle}
              usageStatGridStyle={usageStatGridStyle}
              usageStatCardStyle={usageStatCardStyle}
              usageStatValueStyle={usageStatValueStyle}
              usageStatLabelStyle={usageStatLabelStyle}
              usageGuestBannerStyle={usageGuestBannerStyle}
              inputGridStyle={inputGridStyle}
              cardStyle={cardStyle}
              textareaStyle={textareaStyle}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              resumeText={resumeText}
              fileName={fileName}
              handleFile={handleFile}
              uploadBoxStyle={uploadBoxStyle}
              uploadIconStyle={uploadIconStyle}
              analyze={analyze}
              canRun={canRun}
              primaryButtonStyle={primaryButtonStyle}
              primaryButtonDisabledStyle={primaryButtonDisabledStyle}
              loading={loading}
              error={error}
              errorBoxStyle={errorBoxStyle}
              result={result}
              sectionTitleStyle={sectionTitleStyle}
              scoreRingStyle={scoreRingStyle}
              percentileBadgeStyle={percentileBadgeStyle}
              breakdownGridStyle={breakdownGridStyle}
              breakdownCardStyle={breakdownCardStyle}
              breakdownLabelStyle={breakdownLabelStyle}
              breakdownValueStyle={breakdownValueStyle}
              generateResume={generateResume}
              enhancing={enhancing}
              secondaryButtonStyle={secondaryButtonStyle}
              secondaryButtonDisabledStyle={secondaryButtonDisabledStyle}
              enhanceError={enhanceError}
              tagStyle={tagStyle}
              recNumStyle={recNumStyle}
              enhancedResume={enhancedResume}
              savingPdf={savingPdf}
              primaryButtonInlineStyle={primaryButtonInlineStyle}
              handleDownloadPdf={handleDownloadPdf}
              viewerWrapStyle={viewerWrapStyle}
              viewerStyle={viewerStyle}
              PDFViewer={PDFViewer}
              ResumePdfDocument={ResumePdfDocument}
            />
          ) : null}
        </div>
      </main>

      <footer style={footerStyle}>
        <div style={{ fontSize: 12, color: '#8577ab', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{ width: 8, height: 8, background: '#534AB7', borderRadius: '50%', boxShadow: '0 0 18px #7F77DD' }}
          />
          Built for sharper resume reviews with Llama 3.3 70B via Groq
        </div>
        <div style={{ fontSize: 12, color: '#8577ab' }}>RoleMatcher © 2026</div>
      </footer>
    </div>
  )
}

const {
  appShellStyle,
  navStyle,
  logoIconStyle,
  brandButtonStyle,
  headerActionsStyle,
  navLinkStyle,
  navLinkActiveStyle,
  badgeStyle,
  heroStyle,
  heroPanelStyle,
  heroLayoutStyle,
  eyebrowStyle,
  heroTitleStyle,
  heroSubStyle,
  heroActionsStyle,
  heroMetricRowStyle,
  heroMetricStyle,
  heroMetricValueStyle,
  heroMetricLabelStyle,
  heroPreviewShellStyle,
  heroPreviewTopStyle,
  heroPreviewEyebrowStyle,
  heroPreviewTitleStyle,
  heroPreviewStatusStyle,
  heroPreviewScoreRowStyle,
  heroPreviewScoreCardStyle,
  heroPreviewScoreValueStyle,
  heroPreviewScoreOutOfStyle,
  heroPreviewScoreLabelStyle,
  heroPreviewBarsStyle,
  heroPreviewBarRowStyle,
  heroPreviewBarLabelStyle,
  heroPreviewBarTrackStyle,
  heroPreviewBarFillStyle,
  heroPreviewBarValueStyle,
  heroPreviewTagsStyle,
  heroPreviewTagStyle,
  heroPreviewInsightStyle,
  mainStyle,
  landingSectionStyle,
  featureSectionStyle,
  sectionEyebrowStyle,
  sectionHeadingStyle,
  sectionHeadingDarkStyle,
  statsGridStyle,
  statCardStyle,
  statValueStyle,
  statLabelStyle,
  testimonialShellStyle,
  carouselButtonStyle,
  testimonialCardStyle,
  postHeaderStyle,
  authorRowStyle,
  avatarStyle,
  linkedinBadgeStyle,
  quoteMarkStyle,
  testimonialQuoteStyle,
  testimonialMetaStyle,
  postMetaLineStyle,
  postFooterStyle,
  postStatsStyle,
  postActionsStyle,
  dotsRowStyle,
  dotStyle,
  pricingGridStyle,
  pricingCardStyle,
  featuredPricingStyle,
  featuredBadgeStyle,
  pricingTierStyle,
  pricingTierDarkStyle,
  pricingValueStyle,
  pricingUnitStyle,
  pricingSubStyle,
  pricingSubDarkStyle,
  featureListStyle,
  featureItemStyle,
  featureItemDarkStyle,
  featureTextGroupStyle,
  featureTitleStyle,
  featureTitleDarkStyle,
  featureDescriptionStyle,
  featureDescriptionDarkStyle,
  pricingCaptionStyle,
  ctaPanelStyle,
  ctaTextWrapStyle,
  ctaSupportRowStyle,
  ctaSupportPillStyle,
  faqSectionStyle,
  faqIntroStyle,
  faqListStyle,
  faqItemStyle,
  faqQuestionRowStyle,
  faqQuestionStyle,
  faqToggleStyle,
  faqAnswerStyle,
  workspaceSectionStyle,
  workspaceNoteStyle,
  usagePanelStyle,
  usagePanelTitleStyle,
  usagePanelMetaStyle,
  usageStatGridStyle,
  usageStatCardStyle,
  usageStatValueStyle,
  usageStatLabelStyle,
  usageGuestBannerStyle,
  noticeWrapStyle,
  noticeBoxStyle,
  confirmOverlayStyle,
  confirmModalStyle,
  confirmHeaderStyle,
  confirmTitleStyle,
  confirmCloseStyle,
  confirmBodyStyle,
  confirmActionsStyle,
  confirmSecondaryStyle,
  confirmPrimaryStyle,
  accountSectionStyle,
  accountHeroStyle,
  authLayoutStyle,
  authPanelStyle,
  authBenefitsStyle,
  authBenefitsHeaderStyle,
  authBenefitsTitleStyle,
  authBenefitsBadgeStyle,
  authBenefitsLeadStyle,
  authTabsStyle,
  authTabStyle,
  authTabActiveStyle,
  authFormStyle,
  fieldShellStyle,
  fieldLabelStyle,
  textInputStyle,
  dashboardCardStyle,
  dashboardFieldsStyle,
  dashboardButtonRowStyle,
  dashboardTabsStyle,
  dashboardTabStyle,
  dashboardTabActiveStyle,
  dashboardSignOutStyle,
  subscriptionSummaryStyle,
  subscriptionPlanStyle,
  subscriptionMetaStyle,
  subscriptionChipStyle,
  subscriptionTimerCardStyle,
  subscriptionTimerValueStyle,
  subscriptionTimerMetaStyle,
  adminSummaryGridStyle,
  adminSummaryCardStyle,
  adminSummaryValueStyle,
  adminSummaryMetaStyle,
  adminHeaderRowStyle,
  adminTableStyle,
  adminTableHeaderStyle,
  adminRowStyle,
  adminUserCellStyle,
  adminUserNameStyle,
  adminUserMetaStyle,
  adminPillStyle,
  adminDetailCellStyle,
  adminDetailStrongStyle,
  adminActionsCellStyle,
  demoSectionStyle,
  demoIntroStyle,
  demoStepsStyle,
  demoStepStyle,
  demoStepActiveStyle,
  demoStepEyebrowStyle,
  demoStepTitleStyle,
  demoStepDetailStyle,
  demoCanvasStyle,
  demoPanelStyle,
  demoPanelHeaderStyle,
  demoStatusPillStyle,
  demoUploadBadgeStyle,
  demoTextBlockStyle,
  demoLineStyle,
  demoBulletLineStyle,
  demoBulletDotStyle,
  demoArrowStyle,
  demoResultCardStyle,
  demoResultHeaderStyle,
  demoScoreLabelStyle,
  demoScoreBadgeStyle,
  demoScoreOutOfStyle,
  demoChecksStyle,
  demoCheckRowStyle,
  demoCheckVerdictStyle,
  demoInsightCardStyle,
  demoInsightTitleStyle,
  demoInsightTextStyle,
  demoFooterStyle,
  inputGridStyle,
  cardStyle,
  cardLabelStyle,
  textareaStyle,
  uploadBoxStyle,
  uploadIconStyle,
  sectionTitleStyle,
  scoreRingStyle,
  percentileBadgeStyle,
  tagStyle,
  breakdownGridStyle,
  breakdownCardStyle,
  breakdownLabelStyle,
  breakdownValueStyle,
  recNumStyle,
  errorBoxStyle,
  viewerWrapStyle,
  viewerStyle,
  primaryButtonStyle,
  primaryButtonInlineStyle,
  primaryButtonDisabledStyle,
  secondaryInlineButtonStyle,
  secondaryInlineButtonDisabledStyle,
  dangerGhostButtonStyle,
  secondaryButtonStyle,
  secondaryButtonDisabledStyle,
  footerStyle,
} = appStyles


