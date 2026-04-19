export default function AdminPage({
  currentUser,
  adminSummary,
  adminLoading,
  adminUsers,
  refreshAdminDashboard,
  formatCurrency,
  formatResetTime,
  getPlanConfig,
  openConfirmDialog,
  updateAdminSubscription,
  resetAdminUsage,
  updateAdminRole,
  styles,
}) {
  return (
    <section style={styles.accountSectionStyle}>
      <div style={styles.accountHeroStyle}>
        <div style={styles.sectionEyebrowStyle}>Admin Dashboard</div>
        <div style={styles.sectionHeadingDarkStyle}>Users, subscriptions, usage, and projected revenue</div>
        <div style={styles.workspaceNoteStyle}>
          Internal admin view for managing account access, plan state, and 24-hour usage windows.
        </div>
      </div>

      <div style={styles.adminSummaryGridStyle}>
        <div style={styles.adminSummaryCardStyle}>
          <div style={styles.cardLabelStyle}>Total users</div>
          <div style={styles.adminSummaryValueStyle}>{adminSummary.totalUsers}</div>
          <div style={styles.adminSummaryMetaStyle}>Profiles created in the current database</div>
        </div>
        <div style={styles.adminSummaryCardStyle}>
          <div style={styles.cardLabelStyle}>Active subscriptions</div>
          <div style={styles.adminSummaryValueStyle}>{adminSummary.activePro}</div>
          <div style={styles.adminSummaryMetaStyle}>{adminSummary.pausedPro} paused paid account(s)</div>
        </div>
        <div style={styles.adminSummaryCardStyle}>
          <div style={styles.cardLabelStyle}>Projected MRR</div>
          <div style={styles.adminSummaryValueStyle}>{formatCurrency(adminSummary.projectedMrr)}</div>
          <div style={styles.adminSummaryMetaStyle}>Based on active Plus and Pro accounts at current monthly prices</div>
        </div>
        <div style={styles.adminSummaryCardStyle}>
          <div style={styles.cardLabelStyle}>24h usage</div>
          <div style={styles.adminSummaryValueStyle}>
            {adminSummary.analysesUsed}/{adminSummary.generationsUsed}
          </div>
          <div style={styles.adminSummaryMetaStyle}>Analyses used / generations used across all accounts</div>
        </div>
      </div>

      <div style={styles.dashboardCardStyle}>
        <div style={styles.adminHeaderRowStyle}>
          <div>
            <div style={styles.cardLabelStyle}>User subscriptions</div>
            <div style={styles.subscriptionMetaStyle}>
              Free users: {adminSummary.freeUsers} | Paid users: {adminSummary.activePro + adminSummary.pausedPro}
            </div>
          </div>
          <button
            type="button"
            onClick={refreshAdminDashboard}
            disabled={adminLoading}
            style={adminLoading ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
          >
            {adminLoading ? 'Refreshing...' : 'Refresh data'}
          </button>
        </div>

        <div style={styles.adminTableStyle}>
          <div style={styles.adminTableHeaderStyle}>
            <div>User</div>
            <div>Role</div>
            <div>Subscription</div>
            <div>Money</div>
            <div>24h usage</div>
            <div>Actions</div>
          </div>

          {adminUsers.map(user => {
            const targetPlanKey = user.subscription?.plan || 'free'
            const targetPlanConfig = getPlanConfig(targetPlanKey)
            const planLabel = targetPlanConfig.label
            const statusLabel = user.subscription?.status || 'free'
            const resetLabel = user.usage?.window_start
              ? formatResetTime(new Date(new Date(user.usage.window_start).getTime() + 24 * 60 * 60 * 1000).toISOString())
              : 'Not started'
            const isTargetAdmin = user.role === 'admin'
            const isTargetPaid = targetPlanKey !== 'free'
            const isTargetPlus = targetPlanKey === 'plus'
            const isTargetPro = targetPlanKey === 'pro'

            return (
              <div key={user.id} style={styles.adminRowStyle}>
                <div style={styles.adminUserCellStyle}>
                  <div style={styles.adminUserNameStyle}>{user.full_name || 'Unnamed user'}</div>
                  <div style={styles.adminUserMetaStyle}>{user.email}</div>
                  <div style={styles.adminUserMetaStyle}>Joined {formatResetTime(user.created_at)}</div>
                </div>
                <div>
                  <div style={styles.adminPillStyle}>{isTargetAdmin ? 'Admin' : 'User'}</div>
                </div>
                <div style={styles.adminDetailCellStyle}>
                  <div style={styles.adminDetailStrongStyle}>{planLabel}</div>
                  <div style={styles.adminUserMetaStyle}>Status: {statusLabel}</div>
                  <div style={styles.adminUserMetaStyle}>
                    Renewal: {user.subscription?.current_period_end ? formatResetTime(user.subscription.current_period_end) : 'Not scheduled'}
                  </div>
                </div>
                <div style={styles.adminDetailCellStyle}>
                  <div style={styles.adminDetailStrongStyle}>{formatCurrency(user.monthlyValue)}</div>
                  <div style={styles.adminUserMetaStyle}>
                    Billing: {user.subscription?.billing_email || user.email || 'Not set'}
                  </div>
                  <div style={styles.adminUserMetaStyle}>
                    Payment: {user.subscription?.provider || 'manual'}
                  </div>
                </div>
                <div style={styles.adminDetailCellStyle}>
                  <div style={styles.adminUserMetaStyle}>Analyses: {user.usage?.score_checks_used || 0}/{targetPlanConfig.dailyAnalyses}</div>
                  <div style={styles.adminUserMetaStyle}>Generations: {user.usage?.resume_generations_used || 0}/{targetPlanConfig.dailyGenerations}</div>
                  <div style={styles.adminUserMetaStyle}>Resets: {resetLabel}</div>
                </div>
                <div style={styles.adminActionsCellStyle}>
                  <button
                    type="button"
                    disabled={adminLoading || isTargetPlus}
                    onClick={() =>
                      openConfirmDialog({
                        title: `Set ${user.full_name || user.email} to Plus?`,
                        message: 'This will give the account the 12 analyses + 12 generations daily plan and count it toward projected monthly revenue.',
                        confirmLabel: 'Set Plus',
                        cancelLabel: 'Cancel',
                        onConfirm: () =>
                          updateAdminSubscription(
                            user,
                            {
                              plan: 'plus',
                              status: 'active',
                              auto_renew: true,
                              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            },
                            `${user.full_name || user.email} is now on Plus.`
                          ),
                      })
                    }
                    style={adminLoading || isTargetPlus ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
                  >
                    Set Plus
                  </button>
                  <button
                    type="button"
                    disabled={adminLoading || isTargetPro}
                    onClick={() =>
                      openConfirmDialog({
                        title: `Set ${user.full_name || user.email} to Pro?`,
                        message: 'This will give the account the 20 analyses + 20 generations daily plan and count it toward projected monthly revenue.',
                        confirmLabel: 'Set Pro',
                        cancelLabel: 'Cancel',
                        onConfirm: () =>
                          updateAdminSubscription(
                            user,
                            {
                              plan: 'pro',
                              status: 'active',
                              auto_renew: true,
                              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            },
                            `${user.full_name || user.email} is now on Pro.`
                          ),
                      })
                    }
                    style={adminLoading || isTargetPro ? styles.secondaryInlineButtonDisabledStyle : styles.primaryButtonInlineStyle}
                  >
                    Set Pro
                  </button>
                  <button
                    type="button"
                    disabled={adminLoading || !isTargetPaid}
                    onClick={() =>
                      openConfirmDialog({
                        title: `Switch ${user.full_name || user.email} to free?`,
                        message: 'This removes paid access, clears the paid cycle, and drops the projected monthly revenue for this account to $0.',
                        confirmLabel: 'Switch to free',
                        cancelLabel: 'Keep current plan',
                        onConfirm: () =>
                          updateAdminSubscription(
                            user,
                            {
                              plan: 'free',
                              status: 'free',
                              auto_renew: false,
                              current_period_end: null,
                            },
                            `${user.full_name || user.email} is back on the free plan.`
                          ),
                      })
                    }
                    style={adminLoading || !isTargetPaid ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
                  >
                    Switch to free
                  </button>
                  <button
                    type="button"
                    disabled={adminLoading}
                    onClick={() =>
                      openConfirmDialog({
                        title: `Reset usage for ${user.full_name || user.email}?`,
                        message: 'This will clear the 24-hour analysis and generation counters immediately.',
                        confirmLabel: 'Reset usage',
                        cancelLabel: 'Not now',
                        onConfirm: () => resetAdminUsage(user),
                      })
                    }
                    style={adminLoading ? styles.secondaryInlineButtonDisabledStyle : styles.secondaryInlineButtonStyle}
                  >
                    Reset usage
                  </button>
                  <button
                    type="button"
                    disabled={adminLoading || (currentUser.id === user.id && isTargetAdmin)}
                    onClick={() =>
                      openConfirmDialog({
                        title: `${isTargetAdmin ? 'Remove admin access' : 'Promote to admin'}?`,
                        message: isTargetAdmin
                          ? 'This account will lose admin visibility and management controls.'
                          : 'This account will gain admin access to users, subscriptions, and revenue data.',
                        confirmLabel: isTargetAdmin ? 'Remove admin' : 'Make admin',
                        cancelLabel: 'Cancel',
                        onConfirm: () => updateAdminRole(user, isTargetAdmin ? 'user' : 'admin'),
                      })
                    }
                    style={
                      adminLoading || (currentUser.id === user.id && isTargetAdmin)
                        ? styles.secondaryInlineButtonDisabledStyle
                        : styles.secondaryInlineButtonStyle
                    }
                  >
                    {isTargetAdmin ? 'Remove admin' : 'Make admin'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
