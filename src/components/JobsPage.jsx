import * as appStyles from '../styles/appStyles'

function JobCard({ job, styles, compact = false }) {
  const salary =
    job.salaryMin || job.salaryMax
      ? `$${Math.round(job.salaryMin || job.salaryMax).toLocaleString()} - $${Math.round(
          job.salaryMax || job.salaryMin
        ).toLocaleString()}`
      : 'Salary not listed'
  const postedDate = job.created
    ? new Date(job.created).toLocaleDateString([], { month: 'short', day: 'numeric' })
    : 'Recent'

  return (
    <article style={styles.jobCardStyle}>
      <div style={styles.jobCardTopStyle}>
        <div>
          <div style={styles.jobTitleStyle}>{job.title}</div>
          <div style={styles.jobCompanyStyle}>{job.company}</div>
        </div>
        <div style={styles.jobSourcePillStyle}>{job.source}</div>
      </div>
      <div style={styles.jobPillRowStyle}>
        <span style={styles.jobInfoPillStyle}>{job.location}</span>
        <span style={styles.jobInfoPillStyle}>{salary}</span>
        <span style={styles.jobInfoPillStyle}>{postedDate}</span>
      </div>
      {!compact ? <p style={styles.jobDescriptionStyle}>{job.description}</p> : null}
      <div style={styles.jobFooterStyle}>
        <div style={styles.jobMetaStyle}>Matched to your latest JD</div>
        <a href={job.url} target="_blank" rel="noreferrer" style={styles.jobApplyLinkStyle}>
          View job
        </a>
      </div>
    </article>
  )
}

export default function JobsPage({
  jobRecommendations,
  jobsLoading,
  jobsError,
  latestJobQueryLabel,
  openWorkspace,
  refreshJobs,
  styles,
}) {
  const pageStyles = { ...appStyles, ...styles }

  return (
    <section style={pageStyles.workspaceSectionStyle}>
      <div style={pageStyles.jobsHeroStyle}>
        <div style={pageStyles.jobsHeaderStyle}>
          <div>
            <div style={pageStyles.sectionEyebrowStyle}>Related jobs</div>
            <div style={pageStyles.sectionHeadingDarkStyle}>Recommended roles from your latest job description</div>
            <div style={pageStyles.workspaceNoteStyle}>
              {latestJobQueryLabel
                ? `Based on: ${latestJobQueryLabel}`
                : 'Run an analysis first so RoleMatcher can search jobs related to the description.'}
            </div>
          </div>
          <div style={pageStyles.jobsHeaderActionsStyle}>
            <button type="button" onClick={openWorkspace} style={pageStyles.secondaryInlineButtonStyle}>
              Back to analysis
            </button>
            <button type="button" onClick={refreshJobs} disabled={jobsLoading} style={pageStyles.primaryButtonInlineStyle}>
              {jobsLoading ? 'Refreshing...' : 'Refresh jobs'}
            </button>
          </div>
        </div>

        <div style={pageStyles.jobsStatsRowStyle}>
          <div style={pageStyles.jobsStatPillStyle}>{jobRecommendations.length || 0} roles found</div>
          <div style={pageStyles.jobsStatPillStyle}>Sorted by relevance</div>
          <div style={pageStyles.jobsStatPillStyle}>Fresh listings from Adzuna</div>
        </div>
      </div>

      {jobsError ? <div style={{ ...pageStyles.errorBoxStyle, marginBottom: 16 }}>Jobs: {jobsError}</div> : null}

      {jobRecommendations.length ? (
        <div style={pageStyles.jobsGridStyle}>
          {jobRecommendations.map(job => (
            <JobCard key={job.id} job={job} styles={pageStyles} />
          ))}
        </div>
      ) : (
        <div style={pageStyles.dashboardCardStyle}>
          <div style={pageStyles.cardLabelStyle}>No jobs yet</div>
          <div style={pageStyles.workspaceNoteStyle}>
            Run a resume analysis first. Once the analysis finishes, related jobs will appear here.
          </div>
        </div>
      )}
    </section>
  )
}

export { JobCard }
