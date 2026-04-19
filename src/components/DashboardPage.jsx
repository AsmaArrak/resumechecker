export default function DashboardPage({
  currentUser,
  dashboardTab,
  setDashboardTab,
  handleSignOut,
  handleProfileSave,
  handleBillingSave,
  profileForm,
  setProfileForm,
  billingForm,
  setBillingForm,
  profileLoading,
  subscription,
  subscriptionStatusLabel,
  subscriptionRenewalLabel,
  subscriptionCountdownLabel,
  currentPlanConfig,
  isFreePlan,
  isPaidPlan,
  canSwitchToFree,
  canActivatePlus,
  canActivatePro,
  canPauseSubscription,
  canResumeSubscription,
  openConfirmDialog,
  handleFreePlan,
  handleActivatePaidPlan,
  handlePauseSubscription,
  handleResumeSubscription,
  updateSubscriptionState,
  styles,
}) {
  return (
    <section style={styles.accountSectionStyle}>
      <div style={styles.dashboardTabsStyle}>
        <button
          type="button"
          onClick={() => setDashboardTab('personal')}
          style={dashboardTab === 'personal' ? styles.dashboardTabActiveStyle : styles.dashboardTabStyle}
        >
          Personal information
        </button>
        <button
          type="button"
          onClick={() => setDashboardTab('subscription')}
          style={dashboardTab === 'subscription' ? styles.dashboardTabActiveStyle : styles.dashboardTabStyle}
        >
          Subscriptions
        </button>
        <button
          type="button"
          onClick={() => setDashboardTab('billing')}
          style={dashboardTab === 'billing' ? styles.dashboardTabActiveStyle : styles.dashboardTabStyle}
        >
          Manage billing
        </button>
        <button type="button" onClick={handleSignOut} style={styles.dashboardSignOutStyle}>
          Sign out
        </button>
      </div>

      <div style={{ ...styles.workspaceNoteStyle, marginBottom: 18 }}>Signed in as {currentUser.email}</div>

      {dashboardTab === 'personal' ? (
        <form onSubmit={handleProfileSave} style={styles.dashboardCardStyle}>
          <div style={styles.cardLabelStyle}>Personal information</div>
          <div style={styles.dashboardFieldsStyle}>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Full name</span>
              <input
                value={profileForm.full_name}
                onChange={e => setProfileForm(current => ({ ...current, full_name: e.target.value }))}
                style={styles.textInputStyle}
              />
            </label>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Email</span>
              <input
                value={profileForm.email}
                readOnly
                disabled
                style={{ ...styles.textInputStyle, background: '#f3f0fb', color: '#7a709c', cursor: 'not-allowed' }}
              />
            </label>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Title</span>
              <input
                value={profileForm.title}
                onChange={e => setProfileForm(current => ({ ...current, title: e.target.value }))}
                style={styles.textInputStyle}
                placeholder="Frontend Developer"
              />
            </label>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Location</span>
              <input
                value={profileForm.location}
                onChange={e => setProfileForm(current => ({ ...current, location: e.target.value }))}
                style={styles.textInputStyle}
                placeholder="New York, NY"
              />
            </label>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Company / School</span>
              <input
                value={profileForm.company}
                onChange={e => setProfileForm(current => ({ ...current, company: e.target.value }))}
                style={styles.textInputStyle}
                placeholder="Acme Inc."
              />
            </label>
          </div>
          <div style={styles.dashboardButtonRowStyle}>
            <button type="submit" disabled={profileLoading} style={profileLoading ? styles.primaryButtonDisabledStyle : styles.primaryButtonInlineStyle}>
              {profileLoading ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      ) : null}

      {dashboardTab === 'subscription' ? (
        <div style={styles.dashboardCardStyle}>
          <div style={styles.cardLabelStyle}>Subscriptions</div>
          <div style={styles.subscriptionSummaryStyle}>
            <div>
              <div style={styles.subscriptionPlanStyle}>
                {isFreePlan ? 'Free plan' : `RoleMatcher ${currentPlanConfig.label}`}
              </div>
              <div style={styles.subscriptionMetaStyle}>Status: {subscriptionStatusLabel}</div>
              <div style={styles.subscriptionMetaStyle}>Renewal date: {subscriptionRenewalLabel}</div>
            </div>
            <div style={styles.subscriptionChipStyle}>
              {subscription?.auto_renew ? 'Auto-renew on' : 'Auto-renew off'}
            </div>
          </div>
          <div style={styles.subscriptionTimerCardStyle}>
            <div>
              <div style={styles.cardLabelStyle}>Paid plan time remaining</div>
              <div style={styles.subscriptionTimerValueStyle}>{subscriptionCountdownLabel}</div>
              <div style={styles.subscriptionTimerMetaStyle}>
                {subscription?.status === 'paused'
                  ? 'The countdown is frozen until you resume the subscription.'
                  : isPaidPlan
                    ? `This preview timer tracks the current one-month ${currentPlanConfig.label} cycle.`
                    : 'Activate Plus or Pro to start a one-month paid cycle.'}
              </div>
            </div>
          </div>
          <div style={styles.dashboardButtonRowStyle}>
            <button
              type="button"
              disabled={!canSwitchToFree}
              onClick={() =>
                openConfirmDialog({
                  title: 'Switch to the free plan?',
                  message:
                    'This will move your account back to the free tier and clear any active paid cycle timer.',
                  confirmLabel: 'Switch plan',
                  cancelLabel: 'Stay on current plan',
                  onConfirm: handleFreePlan,
                })
              }
              style={!canSwitchToFree ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
            >
              Switch to free plan
            </button>
            <button
              type="button"
              disabled={!canActivatePlus}
              onClick={() =>
                openConfirmDialog({
                  title: 'Activate Plus?',
                  message:
                    'This will switch the account to Plus and start the one-month preview timer for the 12 + 12 daily plan.',
                  confirmLabel: 'Activate Plus',
                  cancelLabel: 'Cancel',
                  onConfirm: () => handleActivatePaidPlan('plus'),
                })
              }
              style={!canActivatePlus ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
            >
              Activate Plus
            </button>
            <button
              type="button"
              disabled={!canActivatePro}
              onClick={() =>
                openConfirmDialog({
                  title: 'Activate Pro?',
                  message:
                    'This will switch the account to Pro and start the one-month preview timer for the 20 + 20 daily plan.',
                  confirmLabel: 'Activate Pro',
                  cancelLabel: 'Cancel',
                  onConfirm: () => handleActivatePaidPlan('pro'),
                })
              }
              style={!canActivatePro ? styles.primaryButtonDisabledStyle : styles.primaryButtonInlineStyle}
            >
              Activate Pro
            </button>
            <button
              type="button"
              disabled={!canPauseSubscription}
              onClick={() =>
                openConfirmDialog({
                  title: 'Pause subscription?',
                  message:
                    'Pausing will freeze the current paid timer and turn auto-renew off until you resume it.',
                  confirmLabel: 'Pause',
                  cancelLabel: 'Keep running',
                  onConfirm: handlePauseSubscription,
                })
              }
              style={!canPauseSubscription ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
            >
              Pause subscription
            </button>
            <button
              type="button"
              disabled={!canResumeSubscription}
              onClick={() =>
                openConfirmDialog({
                  title: 'Resume subscription?',
                  message:
                    'Resuming will restart the paid timer from the exact remaining time you had left.',
                  confirmLabel: 'Resume',
                  cancelLabel: 'Not now',
                  onConfirm: handleResumeSubscription,
                })
              }
              style={!canResumeSubscription ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
            >
              Resume subscription
            </button>
          </div>
        </div>
      ) : null}

      {dashboardTab === 'billing' ? (
        <form onSubmit={handleBillingSave} style={styles.dashboardCardStyle}>
          <div style={styles.cardLabelStyle}>Manage billing</div>
          <div style={styles.dashboardFieldsStyle}>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Billing email</span>
              <input
                value={billingForm.billing_email}
                onChange={e => setBillingForm(current => ({ ...current, billing_email: e.target.value }))}
                style={styles.textInputStyle}
                placeholder="billing@example.com"
              />
            </label>
            <label style={styles.fieldShellStyle}>
              <span style={styles.fieldLabelStyle}>Payment method</span>
              <input
                value={billingForm.payment_method}
                onChange={e => setBillingForm(current => ({ ...current, payment_method: e.target.value }))}
                style={styles.textInputStyle}
                placeholder="Visa ending in 4242"
              />
            </label>
          </div>
          <div style={styles.dashboardButtonRowStyle}>
            <button type="submit" disabled={profileLoading} style={profileLoading ? styles.primaryButtonDisabledStyle : styles.primaryButtonInlineStyle}>
              {profileLoading ? 'Saving...' : 'Set up payment'}
            </button>
            <button
              type="button"
              onClick={() =>
                updateSubscriptionState(
                  { auto_renew: !(subscription?.auto_renew || false) },
                  'Auto-renew preference updated.'
                )
              }
              style={styles.secondaryInlineButtonStyle}
            >
              {subscription?.auto_renew ? 'Turn off auto-renew' : 'Turn on auto-renew'}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  )
}
