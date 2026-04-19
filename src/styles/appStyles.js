const brandPurple = '#534AB7'
const brandPurpleDark = '#2b184b'
const brandPurpleMid = '#6f63d9'
const brandLavender = '#f5f2ff'
const brandLavenderAlt = '#ede8ff'
const brandText = '#2a2140'
const brandTextSoft = '#6b5b92'
const brandBorder = '#d9d2fb'
const brandWhite = '#ffffff'

const appShellStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background:
    'radial-gradient(circle at top left, rgba(127,119,221,0.18), transparent 24%), linear-gradient(180deg, #160c29 0%, #21113c 24%, #f5f2ff 24%, #f7f4ff 100%)',
}
const navStyle = {
  background: 'rgba(15, 8, 29, 0.78)',
  padding: '1rem 2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  borderBottom: '1px solid rgba(201,195,255,0.12)',
  backdropFilter: 'blur(18px)',
  position: 'sticky',
  top: 0,
  zIndex: 20,
}
const logoIconStyle = {
  width: 58,
  height: 58,
  objectFit: 'contain',
}
const brandButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  background: 'transparent',
  border: 'none',
  color: brandWhite,
  cursor: 'pointer',
  padding: 0,
}
const headerActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  gap: 10,
}
const navLinkStyle = {
  background: 'rgba(138, 126, 213, 0.12)',
  color: brandWhite,
  border: '1px solid rgba(202, 195, 255, 0.18)',
  borderRadius: 999,
  padding: '0.8rem 1.2rem',
  fontWeight: 700,
  cursor: 'pointer',
}
const navLinkActiveStyle = {
  ...navLinkStyle,
  background: 'rgba(138, 126, 213, 0.28)',
  boxShadow: '0 0 0 1px rgba(202,195,255,0.1) inset',
}
const badgeStyle = {
  borderRadius: 999,
  padding: '0.8rem 1rem',
  border: '1px solid rgba(202, 195, 255, 0.18)',
  color: '#d6d0ff',
  fontSize: 13,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}
const heroStyle = {
  width: '100%',
}
const heroPanelStyle = {
  maxWidth: 1180,
  margin: '1.6rem auto 0',
  background: 'linear-gradient(135deg, rgba(43,24,75,0.98), rgba(64,45,122,0.96))',
  border: '1px solid rgba(207,198,255,0.12)',
  borderRadius: 32,
  padding: '2.4rem 2.2rem',
  boxShadow: '0 24px 60px rgba(27, 14, 51, 0.28)',
}
const heroLayoutStyle = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.05fr) minmax(300px, 0.82fr)',
  alignItems: 'center',
  gap: '1.5rem',
}
const eyebrowStyle = {
  color: '#a7a0ff',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontSize: 13,
  fontWeight: 800,
  marginBottom: 14,
}
const heroTitleStyle = {
  color: brandWhite,
  fontSize: '3.2rem',
  lineHeight: 1,
  fontWeight: 800,
  margin: 0,
}
const heroSubStyle = {
  color: '#d6d0ff',
  fontSize: 15,
  lineHeight: 1.55,
  maxWidth: 500,
  marginTop: 14,
}
const heroActionsStyle = {
  display: 'flex',
  gap: 14,
  flexWrap: 'wrap',
  marginTop: 20,
}
const heroMetricRowStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 10,
  marginTop: 18,
}
const heroMetricStyle = {
  borderRadius: 22,
  padding: '0.95rem 1rem',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(219,212,255,0.12)',
}
const heroMetricValueStyle = {
  color: brandWhite,
  fontSize: '1.6rem',
  fontWeight: 800,
}
const heroMetricLabelStyle = {
  color: '#c5beff',
  fontSize: 13,
  marginTop: 4,
}
const heroPreviewShellStyle = {
  background: 'rgba(255,255,255,0.97)',
  borderRadius: 24,
  padding: '1.1rem',
  boxShadow: '0 18px 40px rgba(17, 10, 33, 0.24)',
  color: brandText,
}
const heroPreviewTopStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
}
const heroPreviewEyebrowStyle = {
  color: brandPurpleMid,
  textTransform: 'uppercase',
  letterSpacing: '0.13em',
  fontSize: 11,
  fontWeight: 800,
  marginBottom: 6,
}
const heroPreviewTitleStyle = {
  fontSize: '1rem',
  fontWeight: 800,
  color: brandText,
}
const heroPreviewStatusStyle = {
  background: '#def5e7',
  color: '#117144',
  borderRadius: 999,
  padding: '0.55rem 0.8rem',
  fontWeight: 700,
  fontSize: 13,
}
const heroPreviewScoreRowStyle = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr',
  gap: 12,
  alignItems: 'center',
  marginBottom: 12,
}
const heroPreviewScoreCardStyle = {
  background: brandLavenderAlt,
  borderRadius: 22,
  padding: '1rem 0.8rem',
  textAlign: 'center',
}
const heroPreviewScoreValueStyle = {
  fontSize: '2.1rem',
  color: brandPurple,
  fontWeight: 800,
  lineHeight: 1,
}
const heroPreviewScoreOutOfStyle = {
  fontSize: '1.1rem',
  color: '#7569c8',
}
const heroPreviewScoreLabelStyle = {
  marginTop: 8,
  color: brandTextSoft,
  fontWeight: 700,
  fontSize: 13,
}
const heroPreviewBarsStyle = {
  display: 'grid',
  gap: 10,
}
const heroPreviewBarRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr minmax(100px, 1fr) 46px',
  gap: 10,
  alignItems: 'center',
}
const heroPreviewBarLabelStyle = {
  color: brandText,
  fontWeight: 600,
  fontSize: 14,
}
const heroPreviewBarTrackStyle = {
  background: '#ece7fb',
  height: 10,
  borderRadius: 999,
  overflow: 'hidden',
}
const heroPreviewBarFillStyle = {
  height: '100%',
  borderRadius: 999,
  background: 'linear-gradient(90deg, #5b4fd6, #27d7ac)',
}
const heroPreviewBarValueStyle = {
  color: brandPurple,
  fontWeight: 800,
  textAlign: 'right',
  fontSize: 14,
}
const heroPreviewTagsStyle = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  marginBottom: 12,
}
const heroPreviewTagStyle = {
  background: '#f1eeff',
  color: brandPurple,
  borderRadius: 999,
  padding: '0.5rem 0.8rem',
  fontWeight: 700,
  fontSize: 13,
}
const heroPreviewInsightStyle = {
  borderTop: '1px solid #ede8ff',
  paddingTop: 12,
  color: brandTextSoft,
  lineHeight: 1.55,
  fontSize: 14,
}
const mainStyle = {
  flex: 1,
}
const landingSectionStyle = {
  maxWidth: 1180,
  margin: '0 auto',
  width: '100%',
  padding: '0 1.2rem',
}
const featureSectionStyle = {
  paddingTop: '1.9rem',
}
const sectionEyebrowStyle = eyebrowStyle
const sectionHeadingStyle = {
  color: brandWhite,
  fontSize: '2rem',
  lineHeight: 1.15,
  fontWeight: 800,
}
const sectionHeadingDarkStyle = {
  color: brandText,
  fontSize: '2rem',
  lineHeight: 1.15,
  fontWeight: 800,
}
const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 14,
  marginTop: '1.5rem',
}
const statCardStyle = {
  background: brandWhite,
  borderRadius: 24,
  padding: '1.3rem 1.5rem',
  boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)',
}
const statValueStyle = {
  color: brandPurpleDark,
  fontSize: '2.15rem',
  fontWeight: 800,
}
const statLabelStyle = {
  color: brandTextSoft,
  marginTop: 8,
  fontSize: 13,
}
const testimonialShellStyle = {
  marginTop: '1.2rem',
  background: brandWhite,
  borderRadius: 24,
  padding: '1.1rem',
  boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)',
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '48px minmax(0, 1fr) 48px',
  alignItems: 'center',
  gap: 16,
}
const carouselButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '1px solid #ddd6ff',
  background: brandWhite,
  color: brandPurple,
  fontSize: 22,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  justifySelf: 'center',
  alignSelf: 'center',
}
const testimonialCardStyle = {
  background: 'linear-gradient(135deg, rgba(45,26,83,0.98), rgba(79,58,145,0.95))',
  borderRadius: 24,
  padding: '1.4rem',
  color: brandWhite,
}
const postHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
}
const authorRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
}
const avatarStyle = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  objectFit: 'cover',
}
const linkedinBadgeStyle = {
  width: 42,
  height: 42,
  borderRadius: 12,
  background: brandWhite,
  color: '#0a66c2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: 24,
}
const quoteMarkStyle = { fontSize: '3rem', lineHeight: 1, color: '#bfb7ff', marginTop: 12 }
const testimonialQuoteStyle = { fontSize: '1.2rem', lineHeight: 1.7, color: brandWhite, marginTop: 12 }
const testimonialMetaStyle = { color: '#d6d0ff', lineHeight: 1.55, display: 'grid', gap: 2 }
const postMetaLineStyle = { color: '#bfb7ff', fontSize: 14 }
const postFooterStyle = { borderTop: '1px solid rgba(221,213,255,0.14)', marginTop: 18, paddingTop: 14 }
const postStatsStyle = { color: '#d6d0ff', fontSize: 14 }
const postActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: 18, color: '#d6d0ff' }
const dotsRowStyle = { display: 'flex', gap: 8, marginTop: 14 }
const dotStyle = { width: 10, height: 10, borderRadius: '50%', background: 'rgba(191,183,255,0.35)' }
const pricingGridStyle = { display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 14, marginTop: '1.4rem' }
const pricingCardStyle = {
  background: brandWhite,
  borderRadius: 24,
  padding: '1.35rem',
  boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)',
  position: 'relative',
}
const featuredPricingStyle = {
  background: 'linear-gradient(135deg, rgba(45,26,83,0.98), rgba(79,58,145,0.95))',
  color: brandWhite,
}
const featuredBadgeStyle = {
  position: 'absolute',
  top: 20,
  right: 20,
  borderRadius: 999,
  padding: '0.55rem 0.9rem',
  background: '#d9d2fb',
  color: brandPurpleDark,
  fontSize: 13,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}
const pricingTierStyle = { color: brandText, fontSize: '1.55rem', fontWeight: 800, marginBottom: 10 }
const pricingTierDarkStyle = { ...pricingTierStyle, color: brandWhite }
const pricingValueStyle = { color: brandPurpleDark, fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }
const pricingUnitStyle = { fontSize: '1.15rem', color: brandTextSoft }
const pricingSubStyle = { color: brandTextSoft, lineHeight: 1.65, marginBottom: 18 }
const pricingSubDarkStyle = { ...pricingSubStyle, color: '#d6d0ff' }
const featureListStyle = { display: 'grid', gap: 14 }
const featureItemStyle = {
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  padding: '1rem 1.1rem',
  borderRadius: 22,
  background: '#f6f3ff',
  border: '1px solid #e5defd',
}
const featureItemDarkStyle = {
  ...featureItemStyle,
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(230,223,255,0.12)',
}
const featureTextGroupStyle = { display: 'grid', gap: 4 }
const featureTitleStyle = { color: brandText, fontWeight: 800, fontSize: 15 }
const featureTitleDarkStyle = { ...featureTitleStyle, color: brandWhite }
const featureDescriptionStyle = { color: brandTextSoft, lineHeight: 1.55, fontSize: 14 }
const featureDescriptionDarkStyle = { ...featureDescriptionStyle, color: '#d6d0ff' }
const pricingCaptionStyle = { color: brandTextSoft, textAlign: 'right' }
const ctaPanelStyle = {
  marginTop: '1.4rem',
  background: brandWhite,
  borderRadius: 24,
  padding: '1.4rem',
  boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 18,
}
const ctaTextWrapStyle = { display: 'grid', gap: 12 }
const ctaSupportRowStyle = { display: 'flex', gap: 10, flexWrap: 'wrap' }
const ctaSupportPillStyle = {
  background: '#f2efff',
  color: brandPurple,
  borderRadius: 999,
  padding: '0.55rem 0.9rem',
  fontWeight: 700,
  fontSize: 13,
}
const faqSectionStyle = {
  marginTop: '1.4rem',
  background: brandWhite,
  borderRadius: 24,
  padding: '1.4rem',
  boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)',
}
const faqIntroStyle = { display: 'grid', gap: 10, marginBottom: 18 }
const faqListStyle = { display: 'grid', gap: 12 }
const faqItemStyle = {
  background: '#faf8ff',
  border: '1px solid #ebe4ff',
  borderRadius: 20,
  padding: '1rem 1.1rem',
  textAlign: 'left',
  cursor: 'pointer',
}
const faqQuestionRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }
const faqQuestionStyle = { color: brandText, fontWeight: 700, fontSize: 16 }
const faqToggleStyle = { color: brandPurple, fontSize: 24, lineHeight: 1 }
const faqAnswerStyle = { color: brandTextSoft, lineHeight: 1.7, marginTop: 10 }
const workspaceSectionStyle = {
  maxWidth: 1340,
  margin: '2rem auto 0',
  background: 'rgba(255,255,255,0.94)',
  borderRadius: 34,
  padding: '2rem',
  boxShadow: '0 24px 60px rgba(34, 22, 67, 0.12)',
}
const workspaceNoteStyle = { color: brandTextSoft, lineHeight: 1.7, fontSize: 15 }
const usagePanelStyle = {
  background: '#f2eeff',
  border: '1px solid #ddd6ff',
  borderRadius: 28,
  padding: '1.5rem',
  marginBottom: '1.5rem',
}
const usagePanelTitleStyle = { color: brandPurpleDark, fontSize: '2rem', fontWeight: 800 }
const usagePanelMetaStyle = { color: brandTextSoft, marginTop: 6 }
const usageStatGridStyle = { display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 14, marginTop: 14 }
const usageStatCardStyle = { background: brandWhite, borderRadius: 24, padding: '1.3rem 1.5rem' }
const usageStatValueStyle = { color: brandPurple, fontSize: '2.2rem', fontWeight: 800 }
const usageStatLabelStyle = { color: brandTextSoft, marginTop: 6 }
const usageGuestBannerStyle = {
  background: '#fff4e8',
  border: '1px solid #ffd9b3',
  color: '#9a4f00',
  borderRadius: 18,
  padding: '1rem 1.1rem',
  marginBottom: '1rem',
}
const noticeWrapStyle = { position: 'fixed', top: 96, right: 24, zIndex: 60 }
const noticeBoxStyle = {
  background: '#eafef0',
  color: '#127544',
  padding: '1rem 1.2rem',
  borderRadius: 18,
  boxShadow: '0 18px 36px rgba(20, 70, 40, 0.12)',
  minWidth: 280,
}
const confirmOverlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(17, 10, 33, 0.38)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 70,
  padding: '1.5rem',
}
const confirmModalStyle = { background: brandWhite, borderRadius: 18, width: '100%', maxWidth: 540, boxShadow: '0 24px 60px rgba(17, 10, 33, 0.22)' }
const confirmHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.4rem 1.5rem', borderBottom: '1px solid #ebe4ff' }
const confirmTitleStyle = { color: brandText, fontSize: '1.5rem', fontWeight: 800 }
const confirmCloseStyle = { background: 'transparent', border: 'none', fontSize: 28, color: brandTextSoft, cursor: 'pointer' }
const confirmBodyStyle = { padding: '1.4rem 1.5rem', color: brandTextSoft, lineHeight: 1.7 }
const confirmActionsStyle = { display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '0 1.5rem 1.5rem' }
const confirmSecondaryStyle = { ...navLinkStyle, background: brandWhite, color: '#0a66c2', border: '1px solid #9ec8ff' }
const confirmPrimaryStyle = {
  background: 'linear-gradient(135deg, #6f63d9, #4d42bb)',
  color: brandWhite,
  border: 'none',
  borderRadius: 16,
  padding: '0.8rem 1.1rem',
  fontWeight: 800,
  fontSize: 15,
  cursor: 'pointer',
}
const accountSectionStyle = { maxWidth: 1340, margin: '3.25rem auto 0', padding: '0 1.5rem' }
const accountHeroStyle = { display: 'grid', gap: 10, marginBottom: '1.5rem' }
const authLayoutStyle = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 0.72fr)', gap: 20 }
const authPanelStyle = { background: brandWhite, borderRadius: 28, padding: '1.8rem', boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)' }
const authBenefitsStyle = { ...authPanelStyle, background: 'linear-gradient(135deg, rgba(45,26,83,0.98), rgba(79,58,145,0.95))', color: brandWhite }
const authBenefitsHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 14 }
const authBenefitsTitleStyle = { color: brandWhite, fontSize: '1.7rem', lineHeight: 1.15, fontWeight: 800 }
const authBenefitsBadgeStyle = { ...ctaSupportPillStyle, background: '#d9d2fb', color: brandPurpleDark }
const authBenefitsLeadStyle = { color: '#d6d0ff', lineHeight: 1.7, marginBottom: 16 }
const authTabsStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }
const authTabStyle = { ...navLinkStyle, width: '100%', background: '#f2efff', color: brandPurpleDark, border: '1px solid #ddd6ff' }
const authTabActiveStyle = { ...authTabStyle, background: brandPurple, color: brandWhite, borderColor: brandPurple }
const authFormStyle = { display: 'grid', gap: 16 }
const fieldShellStyle = { display: 'grid', gap: 8 }
const fieldLabelStyle = { color: '#6f63a2', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' }
const textInputStyle = {
  border: '1px solid #ddd6ff',
  borderRadius: 18,
  padding: '1rem 1.05rem',
  outline: 'none',
  fontSize: 16,
  color: brandText,
  background: '#fcfbff',
}
const dashboardCardStyle = { background: brandWhite, borderRadius: 28, padding: '1.8rem', boxShadow: '0 18px 36px rgba(42, 31, 78, 0.1)' }
const dashboardFieldsStyle = { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }
const dashboardButtonRowStyle = { display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }
const dashboardTabsStyle = { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }
const dashboardTabStyle = { ...authTabStyle, width: 'auto' }
const dashboardTabActiveStyle = { ...authTabActiveStyle, width: 'auto' }
const dashboardSignOutStyle = {
  background: '#fff7f7',
  color: '#a62f2f',
  border: '1px solid #efc5c5',
  borderRadius: 999,
  padding: '0.75rem 1rem',
  fontWeight: 700,
  cursor: 'pointer',
}
const subscriptionSummaryStyle = { display: 'grid', gap: 10, marginBottom: 18 }
const subscriptionPlanStyle = { color: brandPurpleDark, fontSize: '2rem', fontWeight: 800 }
const subscriptionMetaStyle = { color: brandTextSoft, lineHeight: 1.65 }
const subscriptionChipStyle = { ...ctaSupportPillStyle, display: 'inline-flex', width: 'fit-content' }
const subscriptionTimerCardStyle = { background: '#f5f2ff', borderRadius: 22, padding: '1.2rem 1.3rem', border: '1px solid #ddd6ff' }
const subscriptionTimerValueStyle = { color: brandPurpleDark, fontSize: '1.8rem', fontWeight: 800 }
const subscriptionTimerMetaStyle = { color: brandTextSoft, marginTop: 6 }
const adminSummaryGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16, marginBottom: 18 }
const adminSummaryCardStyle = { ...dashboardCardStyle, padding: '1.4rem' }
const adminSummaryValueStyle = { color: brandPurpleDark, fontSize: '2.3rem', fontWeight: 800 }
const adminSummaryMetaStyle = { color: brandTextSoft, marginTop: 8, lineHeight: 1.5 }
const adminHeaderRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 16 }
const adminTableStyle = { display: 'grid', gap: 14 }
const adminTableHeaderStyle = { display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 1fr 1fr 1fr 1.25fr', gap: 14, color: '#6f63a2', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 0.4rem' }
const adminRowStyle = { display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 1fr 1fr 1fr 1.25fr', gap: 14, alignItems: 'start', background: '#faf8ff', border: '1px solid #ebe4ff', borderRadius: 24, padding: '1.1rem' }
const adminUserCellStyle = { display: 'grid', gap: 6 }
const adminUserNameStyle = { color: brandText, fontSize: 16, fontWeight: 800 }
const adminUserMetaStyle = { color: brandTextSoft, fontSize: 14, lineHeight: 1.5 }
const adminPillStyle = { ...ctaSupportPillStyle, width: 'fit-content' }
const adminDetailCellStyle = { display: 'grid', gap: 6 }
const adminDetailStrongStyle = { color: brandText, fontWeight: 800 }
const adminActionsCellStyle = { display: 'flex', flexWrap: 'wrap', gap: 8 }
const demoSectionStyle = { marginTop: '2rem', display: 'grid', gap: 18 }
const demoIntroStyle = { display: 'grid', gap: 10 }
const demoStepsStyle = { display: 'flex', gap: 12, flexWrap: 'wrap' }
const demoStepStyle = { ...featureItemStyle, flex: '1 1 180px', cursor: 'pointer' }
const demoStepActiveStyle = { ...featureItemStyle, flex: '1 1 180px', border: `1px solid ${brandPurple}`, boxShadow: '0 10px 24px rgba(83, 74, 183, 0.14)' }
const demoStepEyebrowStyle = { ...sectionEyebrowStyle, marginBottom: 6, fontSize: 11 }
const demoStepTitleStyle = { color: brandText, fontWeight: 800 }
const demoStepDetailStyle = { color: brandTextSoft, lineHeight: 1.6, fontSize: 14 }
const demoCanvasStyle = { display: 'grid', gridTemplateColumns: '0.95fr 40px 1.05fr', gap: 18, alignItems: 'center' }
const demoPanelStyle = { ...dashboardCardStyle, padding: '1.3rem' }
const demoPanelHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }
const demoStatusPillStyle = { ...ctaSupportPillStyle, background: '#def5e7', color: '#117144' }
const demoUploadBadgeStyle = { ...ctaSupportPillStyle }
const demoTextBlockStyle = { display: 'grid', gap: 10 }
const demoLineStyle = { height: 12, borderRadius: 999, background: '#efeaff' }
const demoBulletLineStyle = { display: 'flex', gap: 10, alignItems: 'center' }
const demoBulletDotStyle = { width: 8, height: 8, borderRadius: '50%', background: brandPurple }
const demoArrowStyle = { color: brandPurple, fontSize: 32, textAlign: 'center' }
const demoResultCardStyle = { ...dashboardCardStyle, background: '#f8f6ff' }
const demoResultHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14 }
const demoScoreLabelStyle = { color: brandTextSoft, fontWeight: 700 }
const demoScoreBadgeStyle = { color: brandPurpleDark, fontSize: '2rem', fontWeight: 800 }
const demoScoreOutOfStyle = { color: brandTextSoft, fontSize: '1rem' }
const demoChecksStyle = { display: 'grid', gap: 10 }
const demoCheckRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '0.8rem 0', borderBottom: '1px solid #ece7fb' }
const demoCheckVerdictStyle = { ...ctaSupportPillStyle }
const demoInsightCardStyle = { ...usagePanelStyle, marginBottom: 0 }
const demoInsightTitleStyle = { color: brandText, fontWeight: 800, marginBottom: 6 }
const demoInsightTextStyle = { color: brandTextSoft, lineHeight: 1.65 }
const demoFooterStyle = { marginTop: 14 }
const inputGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: '1.5rem' }
const cardStyle = { background: brandWhite, borderRadius: 28, padding: '1.6rem', boxShadow: '0 18px 36px rgba(42, 31, 78, 0.08)' }
const cardLabelStyle = { color: '#7b70b4', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }
const textareaStyle = { ...textInputStyle, minHeight: 220, resize: 'vertical', width: '100%' }
const uploadBoxStyle = { border: '1px dashed #b9aef6', borderRadius: 24, minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem', cursor: 'pointer', background: '#fcfbff' }
const uploadIconStyle = { width: 56, height: 56, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#f1eeff', color: brandPurple, fontSize: 28, marginBottom: 12 }
const sectionTitleStyle = { color: brandText, fontSize: '1.8rem', fontWeight: 800 }
const scoreRingStyle = { width: 150, height: 150, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'conic-gradient(#534AB7 0deg 300deg, #ece7fb 300deg 360deg)', color: brandPurpleDark, fontWeight: 800, fontSize: '2rem' }
const percentileBadgeStyle = { ...ctaSupportPillStyle, width: 'fit-content' }
const tagStyle = { ...ctaSupportPillStyle, background: '#f1eeff' }
const breakdownGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }
const breakdownCardStyle = { background: '#f7f4ff', border: '1px solid #ebe4ff', borderRadius: 22, padding: '1.1rem' }
const breakdownLabelStyle = { color: brandTextSoft, fontSize: 13, fontWeight: 700 }
const breakdownValueStyle = { color: brandPurpleDark, fontSize: '1.8rem', fontWeight: 800, marginTop: 6 }
const recNumStyle = { width: 32, height: 32, borderRadius: '50%', background: '#efeaff', color: brandPurpleDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }
const errorBoxStyle = { background: '#fff1f1', border: '1px solid #f7c8c8', color: '#9d3030', borderRadius: 18, padding: '0.95rem 1rem' }
const viewerWrapStyle = { borderRadius: 24, overflow: 'hidden', border: '1px solid #ebe4ff', minHeight: 720 }
const viewerStyle = { width: '100%', height: 720, border: 'none' }
const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #6f63d9, #4d42bb)',
  color: brandWhite,
  border: 'none',
  borderRadius: 18,
  padding: '1rem 1.35rem',
  fontWeight: 800,
  fontSize: 16,
  cursor: 'pointer',
  boxShadow: '0 14px 26px rgba(83, 74, 183, 0.28)',
}
const primaryButtonInlineStyle = { ...primaryButtonStyle, padding: '0.8rem 1.1rem', borderRadius: 16, fontSize: 15 }
const primaryButtonDisabledStyle = { ...primaryButtonStyle, opacity: 0.55, cursor: 'not-allowed', boxShadow: 'none' }
const secondaryInlineButtonStyle = { ...navLinkStyle, background: brandWhite, color: brandPurpleDark, border: '1px solid #ddd6ff', padding: '0.75rem 1rem' }
const secondaryInlineButtonDisabledStyle = { ...secondaryInlineButtonStyle, opacity: 0.55, cursor: 'not-allowed' }
const dangerGhostButtonStyle = { ...secondaryInlineButtonStyle, color: '#a62f2f', border: '1px solid #efc5c5', background: '#fff7f7' }
const secondaryButtonStyle = { ...secondaryInlineButtonStyle, width: '100%', justifyContent: 'center' }
const secondaryButtonDisabledStyle = { ...secondaryButtonStyle, opacity: 0.55, cursor: 'not-allowed' }
const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  padding: '1.2rem 2rem 2rem',
}

export {
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
}
