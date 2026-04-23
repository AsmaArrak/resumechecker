export default function WorkspacePage({
  currentUser,
  isFreePlan,
  currentPlanConfig,
  usageResetLabel,
  usageStatus,
  sectionEyebrowStyle,
  sectionHeadingDarkStyle,
  workspaceSectionStyle,
  workspaceNoteStyle,
  usagePanelStyle,
  cardLabelStyle,
  usagePanelTitleStyle,
  usagePanelMetaStyle,
  usageStatGridStyle,
  usageStatCardStyle,
  usageStatValueStyle,
  usageStatLabelStyle,
  usageGuestBannerStyle,
  inputGridStyle,
  cardStyle,
  textareaStyle,
  jobDescription,
  setJobDescription,
  resumeText,
  fileName,
  handleFile,
  uploadBoxStyle,
  uploadIconStyle,
  analyze,
  canRun,
  primaryButtonStyle,
  primaryButtonDisabledStyle,
  loading,
  error,
  errorBoxStyle,
  result,
  sectionTitleStyle,
  scoreRingStyle,
  percentileBadgeStyle,
  breakdownGridStyle,
  breakdownCardStyle,
  breakdownLabelStyle,
  breakdownValueStyle,
  generateResume,
  enhancing,
  secondaryButtonStyle,
  secondaryButtonDisabledStyle,
  enhanceError,
  tagStyle,
  recNumStyle,
  enhancedResume,
  savingPdf,
  primaryButtonInlineStyle,
  handleDownloadPdf,
  viewerWrapStyle,
  viewerStyle,
  PDFViewer,
  ResumePdfDocument,
  jobRecommendations,
  jobsLoading,
  jobsError,
  openJobsPage,
  refreshJobs,
  jobsCarouselStyle,
  jobCardStyle,
  jobCardTopStyle,
  jobTitleStyle,
  jobCompanyStyle,
  jobSourcePillStyle,
  jobMetaStyle,
  jobApplyLinkStyle,
  jobsHeaderActionsStyle,
}) {
  const generateResumeButtonStyle = {
    ...secondaryButtonStyle,
    background: 'linear-gradient(135deg, #ff3d6e, #c9163f)',
    color: '#ffffff',
    border: '1px solid rgba(255, 61, 110, 0.4)',
    boxShadow: '0 18px 34px rgba(201, 22, 63, 0.28), 0 0 0 6px rgba(255, 61, 110, 0.08)',
    fontSize: 17,
    minHeight: 58,
    letterSpacing: '0.01em',
  }
  const generateResumeDisabledStyle = {
    ...generateResumeButtonStyle,
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: 'none',
  }

  return (
    <section id="workspace" style={workspaceSectionStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'end', flexWrap: 'wrap', marginBottom: 18 }}>
        <div>
          <div style={sectionEyebrowStyle}>Workspace</div>
          <div style={sectionHeadingDarkStyle}>Analyze your resume against a real job description</div>
        </div>
        <div style={workspaceNoteStyle}>Upload a PDF resume, run a score check, then generate an optimized version.</div>
      </div>

      {currentUser ? (
        <div style={usagePanelStyle}>
          <div>
            <div style={cardLabelStyle}>Usage window</div>
            <div style={usagePanelTitleStyle}>
              {isFreePlan ? 'Free beta limits' : `${currentPlanConfig.label} daily limits`}
            </div>
            <div style={usagePanelMetaStyle}>
              {!isFreePlan
                ? `${currentPlanConfig.label} gives you ${currentPlanConfig.dailyAnalyses} analyses and ${currentPlanConfig.dailyGenerations} resume generations every 24 hours.`
                : usageResetLabel
                  ? `Free attempts reset ${usageResetLabel}.`
                  : 'Free attempts reset every 24 hours.'}
            </div>
          </div>

          <div style={usageStatGridStyle}>
            <div style={usageStatCardStyle}>
              <div style={usageStatValueStyle}>
                {usageStatus?.analyses_remaining ?? currentPlanConfig.dailyAnalyses}
              </div>
              <div style={usageStatLabelStyle}>Analyses left</div>
            </div>
            <div style={usageStatCardStyle}>
              <div style={usageStatValueStyle}>
                {usageStatus?.generations_remaining ?? currentPlanConfig.dailyGenerations}
              </div>
              <div style={usageStatLabelStyle}>Resume generations left</div>
            </div>
          </div>
        </div>
      ) : null}

      <div style={inputGridStyle}>
        <div style={cardStyle}>
          <div style={cardLabelStyle}>Job description</div>
          <textarea
            rows={6}
            placeholder="Paste the full job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            style={textareaStyle}
          />
        </div>

        <div style={cardStyle}>
          <div style={cardLabelStyle}>Your resume</div>
          <label
            style={{
              ...uploadBoxStyle,
              borderColor: resumeText ? '#534AB7' : '#c4b8e8',
              background: resumeText ? '#EEEDFE' : '#f9f8fe',
              cursor: 'pointer',
              display: 'block',
            }}
          >
            <div style={uploadIconStyle}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 13V5M10 5L7 8M10 5l3 3"
                  stroke="#534AB7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 14v1.5A1.5 1.5 0 005.5 17h9a1.5 1.5 0 001.5-1.5V14"
                  stroke="#534AB7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div style={{ fontSize: 13, color: '#6b5f8a' }}>
              {resumeText ? (
                <>
                  <strong style={{ color: '#534AB7' }}>{fileName}</strong>
                  <br />
                  <span style={{ fontSize: 12, color: '#8a7aaa' }}>Ready to analyze</span>
                </>
              ) : (
                <>
                  <strong style={{ color: '#534AB7' }}>Click to upload</strong> your resume PDF
                </>
              )}
            </div>

            <input type="file" accept=".pdf" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <button
        onClick={analyze}
        disabled={!canRun}
        style={{
          ...(canRun ? primaryButtonStyle : primaryButtonDisabledStyle),
          width: '100%',
          marginBottom: '2rem',
        }}
      >
        {loading ? 'Analyzing your resume...' : 'Analyze Match for Free ->'}
      </button>

      {error && <div style={errorBoxStyle}>Error: {error}</div>}

      {result && (
        <div>
          <div style={sectionTitleStyle}>Your results</div>

          <div style={{ ...cardStyle, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  ...scoreRingStyle,
                  background: `conic-gradient(#534AB7 0deg ${Math.max(
                    0,
                    Math.min(100, Number(result.match_score) || 0)
                  ) * 3.6}deg, #ece7fb ${Math.max(0, Math.min(100, Number(result.match_score) || 0)) * 3.6}deg 360deg)`,
                }}
              >
                <div
                  style={{
                    width: 94,
                    height: 94,
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    boxShadow: 'inset 0 0 0 1px #f0ecfc',
                  }}
                >
                  <span style={{ fontSize: 28, fontWeight: 800, color: '#3C3489', lineHeight: 1 }}>
                    {result.match_score}
                  </span>
                  <span style={{ fontSize: 10, color: '#7F77DD', marginTop: 2 }}>/ 100</span>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1a0a2e', marginBottom: 4 }}>
                  {result.score_label}
                </div>
                <div style={{ fontSize: 14, color: '#6b5f8a', lineHeight: 1.5 }}>
                  {result.summary}
                </div>
                {result.percentile ? (
                  <div style={percentileBadgeStyle}>{result.percentile}</div>
                ) : null}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0ecfc', margin: '1.25rem 0' }} />

            <div style={breakdownGridStyle}>
              <div style={breakdownCardStyle}>
                <div style={breakdownLabelStyle}>Hard requirements</div>
                <div style={breakdownValueStyle}>{result.score_breakdown.hard_requirements_score}/45</div>
              </div>
              <div style={breakdownCardStyle}>
                <div style={breakdownLabelStyle}>Relevant experience</div>
                <div style={breakdownValueStyle}>{result.score_breakdown.relevant_experience_score}/25</div>
              </div>
              <div style={breakdownCardStyle}>
                <div style={breakdownLabelStyle}>Achievements</div>
                <div style={breakdownValueStyle}>{result.score_breakdown.achievements_score}/20</div>
              </div>
              <div style={breakdownCardStyle}>
                <div style={breakdownLabelStyle}>Preferred qualifications</div>
                <div style={breakdownValueStyle}>
                  {result.score_breakdown.preferred_qualifications_score}/10
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f0ecfc', margin: '1.25rem 0' }} />

            <button
              onClick={generateResume}
              disabled={enhancing}
              style={enhancing ? generateResumeDisabledStyle : generateResumeButtonStyle}
            >
              {enhancing ? 'Generating your enhanced resume...' : 'Generate a stronger targeted resume'}
            </button>

            {enhanceError ? <div style={{ ...errorBoxStyle, marginTop: 10 }}>Error: {enhanceError}</div> : null}
          </div>

          <div style={{ ...cardStyle, marginBottom: '1rem' }}>
            <div style={cardLabelStyle}>Matched skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(result.matched_skills || []).map(s => (
                <span key={s} style={{ ...tagStyle, background: '#EEEDFE', color: '#3C3489' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: '1rem' }}>
            <div style={cardLabelStyle}>Role requirements</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {(result.requirements_assessment || []).map((item, i) => {
                const verdictTone =
                  item.verdict === 'met'
                    ? { background: '#ecfdf3', color: '#166534' }
                    : item.verdict === 'partial'
                      ? { background: '#fff7ed', color: '#9a3412' }
                      : { background: '#fdecea', color: '#7f1d1d' }

                return (
                  <div
                    key={`${item.requirement}-${i}`}
                    style={{
                      border: '1px solid #ece7fb',
                      borderRadius: 10,
                      padding: '12px 14px',
                      background: '#fcfbff',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#2a2140' }}>
                        {item.requirement}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={{ ...tagStyle, background: '#f4f1ff', color: '#4c3d91' }}>
                          {item.priority}
                        </span>
                        <span style={{ ...tagStyle, ...verdictTone }}>{item.verdict}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#5a4a7a', lineHeight: 1.55 }}>{item.evidence}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ ...cardStyle, marginBottom: '1rem' }}>
            <div style={cardLabelStyle}>Missing skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(result.missing_skills || []).map(s => (
                <span key={s} style={{ ...tagStyle, background: '#fdecea', color: '#7f1d1d' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {result.critical_gaps?.length ? (
            <div style={{ ...cardStyle, marginBottom: '1rem' }}>
              <div style={cardLabelStyle}>Critical gaps</div>
              {result.critical_gaps.map((gap, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                  <div style={{ ...recNumStyle, background: '#fdecea', color: '#7f1d1d' }}>{i + 1}</div>
                  <div style={{ fontSize: 14, color: '#3a3050', lineHeight: 1.6 }}>{gap}</div>
                </div>
              ))}
            </div>
          ) : null}

          <div style={{ ...cardStyle, marginBottom: '2rem' }}>
            <div style={cardLabelStyle}>Recommendations</div>
            {(result.recommendations || []).map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                <div style={recNumStyle}>{i + 1}</div>
                <div style={{ fontSize: 14, color: '#3a3050', lineHeight: 1.6 }}>{r}</div>
              </div>
            ))}
          </div>

          <div style={{ ...cardStyle, marginBottom: '2rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                marginBottom: 14,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={cardLabelStyle}>Recommended jobs</div>
                <div style={{ fontSize: 14, color: '#6b5f8a' }}>
                  Fresh listings related to the job description you just analyzed.
                </div>
              </div>
              <div style={jobsHeaderActionsStyle}>
                <button type="button" onClick={refreshJobs} disabled={jobsLoading} style={secondaryButtonStyle}>
                  {jobsLoading ? 'Loading jobs...' : 'Refresh'}
                </button>
                <button type="button" onClick={openJobsPage} style={primaryButtonInlineStyle}>
                  See more
                </button>
              </div>
            </div>

            {jobsError ? <div style={{ ...errorBoxStyle, marginBottom: 12 }}>Jobs: {jobsError}</div> : null}

            {jobRecommendations.length ? (
              <div style={jobsCarouselStyle}>
                {jobRecommendations.slice(0, 8).map(job => (
                  <article key={job.id} style={{ ...jobCardStyle, minWidth: 280 }}>
                    <div style={jobCardTopStyle}>
                      <div>
                        <div style={jobTitleStyle}>{job.title}</div>
                        <div style={jobCompanyStyle}>{job.company}</div>
                      </div>
                      <div style={jobSourcePillStyle}>{job.source}</div>
                    </div>
                    <div style={jobMetaStyle}>{job.location}</div>
                    <a href={job.url} target="_blank" rel="noreferrer" style={jobApplyLinkStyle}>
                      View job
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: 14, color: '#6b5f8a', lineHeight: 1.6 }}>
                {jobsLoading
                  ? 'Finding related jobs...'
                  : result
                    ? 'No related jobs found yet. Try Refresh to search again.'
                    : 'Related jobs will appear here after the analysis finishes.'}
              </div>
            )}
          </div>

          {enhancedResume ? (
            <div>
              <div style={{ ...cardStyle, marginBottom: '1rem' }}>
                <div style={cardLabelStyle}>What changed in your CV</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
                  {[
                    ['Added', enhancedResume.change_summary?.added || [], '#ecfdf3', '#166534'],
                    ['Removed or shortened', enhancedResume.change_summary?.removed || [], '#fff7ed', '#9a3412'],
                    ['Rewritten', enhancedResume.change_summary?.rewritten || [], '#f1eeff', '#3C3489'],
                    ['Kept because relevant', enhancedResume.change_summary?.kept || [], '#f8f6ff', '#5a4a7a'],
                  ].map(([label, items, background, color]) => (
                    <div
                      key={label}
                      style={{
                        border: '1px solid #ece7fb',
                        borderRadius: 18,
                        background,
                        padding: '1rem',
                      }}
                    >
                      <div style={{ fontWeight: 800, color, marginBottom: 8 }}>{label}</div>
                      {items.length ? (
                        <ul style={{ margin: 0, paddingLeft: 18, color: '#3a3050', lineHeight: 1.55, fontSize: 14 }}>
                          {items.map((item, index) => (
                            <li key={`${label}-${index}`}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <div style={{ color: '#6b5f8a', fontSize: 14, lineHeight: 1.55 }}>
                          No major changes in this category.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: '1rem',
                }}
              >
                <div style={sectionTitleStyle}>Generated PDF preview</div>
                <button
                  onClick={handleDownloadPdf}
                  disabled={savingPdf}
                  style={savingPdf ? primaryButtonDisabledStyle : primaryButtonInlineStyle}
                >
                  {savingPdf ? 'Downloading...' : 'Download PDF'}
                </button>
              </div>

              <div style={viewerWrapStyle}>
                <PDFViewer style={viewerStyle} showToolbar>
                  <ResumePdfDocument resume={enhancedResume} />
                </PDFViewer>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}
