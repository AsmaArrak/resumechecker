export default function AuthPage({
  authMode,
  setAuthMode,
  authForm,
  handleAuthFieldChange,
  handleSignIn,
  handleCreateAccount,
  authError,
  authLoading,
  styles,
  FeatureList,
  authBenefitItems,
}) {
  return (
    <section style={styles.accountSectionStyle}>
      <div style={styles.accountHeroStyle}>
        <div style={styles.sectionEyebrowStyle}>Accounts</div>
        <div style={styles.sectionHeadingDarkStyle}>
          {authMode === 'signin' ? 'Sign in to run your free resume analysis' : 'Create your free RoleMatcher account'}
        </div>
        <div style={styles.workspaceNoteStyle}>
          RoleMatcher is 100% free right now. Use email and password. Email sign-ups require confirmation before the first login.
        </div>
      </div>

      <div style={styles.authLayoutStyle}>
        <div style={styles.authPanelStyle}>
          <div style={styles.authTabsStyle}>
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              style={authMode === 'signin' ? styles.authTabActiveStyle : styles.authTabStyle}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('create')}
              style={authMode === 'create' ? styles.authTabActiveStyle : styles.authTabStyle}
            >
              Create account
            </button>
          </div>

          <form onSubmit={authMode === 'signin' ? handleSignIn : handleCreateAccount} style={styles.authFormStyle}>
            {authMode === 'create' ? (
              <label style={styles.fieldShellStyle}>
                <span style={styles.fieldLabelStyle}>Full name</span>
                <input
                  value={authForm.name}
                  onChange={e => handleAuthFieldChange('name', e.target.value)}
                  style={styles.textInputStyle}
                  placeholder="Maya Reynolds"
                />
              </label>
            ) : null}

            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={authForm.email}
                onChange={e => handleAuthFieldChange('email', e.target.value)}
                style={styles.textInputStyle}
                placeholder="you@example.com"
              />
            </label>

            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Password</span>
              <input
                type="password"
                autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'}
                value={authForm.password}
                onChange={e => handleAuthFieldChange('password', e.target.value)}
                style={styles.textInputStyle}
                placeholder="Password"
              />
            </label>

            {authError ? <div style={styles.errorBoxStyle}>Error: {authError}</div> : null}

            <button type="submit" disabled={authLoading} style={authLoading ? styles.primaryButtonDisabledStyle : styles.primaryButtonStyle}>
              {authLoading
                ? authMode === 'signin'
                  ? 'Signing in...'
                  : 'Creating account...'
                : authMode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>
        </div>

        <div style={styles.authBenefitsStyle}>
          <div style={styles.authBenefitsHeaderStyle}>
            <div>
              <div style={{ ...styles.cardLabelStyle, color: '#bfb7ff', marginBottom: 8 }}>What you get</div>
              <div style={styles.authBenefitsTitleStyle}>A calmer, sharper way to start your job search</div>
            </div>
            <div style={styles.authBenefitsBadgeStyle}>100% Free</div>
          </div>
          <div style={styles.authBenefitsLeadStyle}>
            Create an account once, then keep your scoring history and profile details ready for every new role.
          </div>
          <FeatureList items={authBenefitItems} dark />
        </div>
      </div>
    </section>
  )
}
