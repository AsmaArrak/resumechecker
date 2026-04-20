export default function HomePage({
  landingStats,
  CountUpValue,
  sectionEyebrowStyle,
  sectionHeadingStyle,
  sectionHeadingDarkStyle,
  landingSectionStyle,
  statsGridStyle,
  statCardStyle,
  statValueStyle,
  statLabelStyle,
  cardStyle,
  featureSectionStyle,
  testimonialShellStyle,
  testimonialCardStyle,
  carouselButtonStyle,
  currentTestimonial,
  postHeaderStyle,
  authorRowStyle,
  avatarStyle,
  testimonialMetaStyle,
  postMetaLineStyle,
  linkedinBadgeStyle,
  quoteMarkStyle,
  testimonialQuoteStyle,
  postFooterStyle,
  postStatsStyle,
  postActionsStyle,
  dotsRowStyle,
  dotStyle,
  testimonials,
  activeTestimonial,
  setActiveTestimonial,
  pricingCaptionStyle,
  pricingGridStyle,
  pricingCardStyle,
  pricingTierDarkStyle,
  pricingTierStyle,
  pricingValueStyle,
  pricingUnitStyle,
  pricingSubDarkStyle,
  pricingSubStyle,
  featuredBadgeStyle,
  featuredPricingStyle,
  FeatureList,
  freePlanItems,
  plusPlanItems,
  proPlanItems,
  ctaPanelStyle,
  ctaTextWrapStyle,
  ctaSupportRowStyle,
  ctaSupportPillStyle,
  primaryButtonStyle,
  openWorkspace,
  faqSectionStyle,
  faqIntroStyle,
  workspaceNoteStyle,
  faqListStyle,
  faqItems,
  openFaqIndex,
  setOpenFaqIndex,
  faqItemStyle,
  faqQuestionRowStyle,
  faqQuestionStyle,
  faqToggleStyle,
  faqAnswerStyle,
}) {
  return (
    <>
      <section style={{ ...landingSectionStyle, marginTop: '2.2rem', marginBottom: '2.2rem' }}>
        <div style={statsGridStyle}>
          {landingStats.map(stat => (
            <div key={stat.label} style={statCardStyle}>
              <div style={statValueStyle}>
                <CountUpValue value={stat.value} />
              </div>
              <div style={statLabelStyle}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...landingSectionStyle, marginTop: '1.4rem' }}>
        <div style={{ ...cardStyle, ...featureSectionStyle }}>
          <div style={sectionEyebrowStyle}>Success Stories</div>
          <div style={sectionHeadingDarkStyle}>People are landing interviews with sharper, targeted resumes</div>
          <div style={testimonialShellStyle}>
            <button
              type="button"
              onClick={() => setActiveTestimonial(current => (current - 1 + testimonials.length) % testimonials.length)}
              style={carouselButtonStyle}
              aria-label="Previous testimonial"
            >
              {'<'}
            </button>
            <div style={testimonialCardStyle}>
              <div style={postHeaderStyle}>
                <div style={authorRowStyle}>
                  <img src={currentTestimonial.avatar} alt="" style={avatarStyle} />
                  <div style={testimonialMetaStyle}>
                    <strong>{currentTestimonial.name}</strong>
                    <span>{currentTestimonial.role}</span>
                    <span style={postMetaLineStyle}>{currentTestimonial.meta}</span>
                  </div>
                </div>
                <div style={linkedinBadgeStyle}>in</div>
              </div>
              <div style={quoteMarkStyle}>"</div>
              <div style={testimonialQuoteStyle}>{currentTestimonial.quote}</div>
              <div style={postFooterStyle}>
                <div style={postStatsStyle}>{currentTestimonial.stats}</div>
                <div style={postActionsStyle}>
                  <span>Like</span>
                  <span>Comment</span>
                  <span>Share</span>
                </div>
              </div>
              <div style={dotsRowStyle}>
                {testimonials.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setActiveTestimonial(index)}
                    style={{
                      ...dotStyle,
                      background: index === activeTestimonial ? '#7F77DD' : 'rgba(127,119,221,0.2)',
                    }}
                    aria-label={`Show testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTestimonial(current => (current + 1) % testimonials.length)}
              style={carouselButtonStyle}
              aria-label="Next testimonial"
            >
              {'>'}
            </button>
          </div>
        </div>
      </section>

      <section style={landingSectionStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 20,
            alignItems: 'end',
            flexWrap: 'wrap',
            marginBottom: 18,
            paddingTop: 14,
          }}
        >
          <div>
            <div style={sectionEyebrowStyle}>Pricing</div>
            <div style={sectionHeadingDarkStyle}>Free, Plus, and Pro plans for different job search intensity</div>
          </div>
          <div style={pricingCaptionStyle}>RoleMatcher is 100% free right now, with paid plans ready to launch later</div>
        </div>
        <div style={pricingGridStyle}>
          <div style={{ ...cardStyle, ...pricingCardStyle }}>
            <div style={pricingTierStyle}>Free</div>
            <div style={pricingValueStyle}>$0</div>
            <div style={pricingSubStyle}>Start free with the daily beta limits and try the full product flow.</div>
            <FeatureList items={freePlanItems} />
          </div>
          <div style={{ ...cardStyle, ...pricingCardStyle }}>
            <div style={featuredBadgeStyle}>Most Popular</div>
            <div style={pricingTierStyle}>Plus</div>
            <div style={pricingValueStyle}>$4.99<span style={pricingUnitStyle}>/month</span></div>
            <div style={pricingSubStyle}>A stronger daily limit for active job seekers who want more room to tailor applications.</div>
            <FeatureList items={plusPlanItems} />
          </div>
          <div style={{ ...cardStyle, ...pricingCardStyle, ...featuredPricingStyle }}>
            <div style={featuredBadgeStyle}>High Volume</div>
            <div style={pricingTierDarkStyle}>Pro</div>
            <div style={pricingValueStyle}>
              <span style={{ color: '#ffffff' }}>$8.99</span>
              <span style={{ ...pricingUnitStyle, color: '#d6d0ff' }}>/month</span>
            </div>
            <div style={pricingSubDarkStyle}>The highest daily cap for heavier application volume and faster iteration across many roles.</div>
            <FeatureList items={proPlanItems} dark />
          </div>
        </div>
      </section>

      <section style={landingSectionStyle}>
        <div style={ctaPanelStyle}>
          <div style={ctaTextWrapStyle}>
            <div style={sectionEyebrowStyle}>Ready To Start?</div>
            <div style={sectionHeadingDarkStyle}>Upload your resume, paste a job description, and try the 100% free analysis flow.</div>
            <div style={ctaSupportRowStyle}>
              <div style={ctaSupportPillStyle}>No credit card</div>
              <div style={ctaSupportPillStyle}>Free beta access</div>
              <div style={ctaSupportPillStyle}>JD-based scoring</div>
            </div>
          </div>
          <button type="button" onClick={openWorkspace} style={primaryButtonStyle} className="hero-cta-button">
            Let's start for free
          </button>
        </div>
      </section>

      <section style={landingSectionStyle}>
        <div style={faqSectionStyle}>
          <div style={faqIntroStyle}>
            <div style={sectionEyebrowStyle}>Common Questions</div>
            <div style={sectionHeadingDarkStyle}>Answers people usually want before they try RoleMatcher</div>
            <div style={workspaceNoteStyle}>
              A quick overview of how the free beta works, when sign-in appears, and how the scoring stays grounded.
            </div>
          </div>

          <div style={faqListStyle}>
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index

              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                  style={faqItemStyle}
                >
                  <div style={faqQuestionRowStyle}>
                    <div style={faqQuestionStyle}>{item.question}</div>
                    <div style={faqToggleStyle}>{isOpen ? '−' : '+'}</div>
                  </div>
                  {isOpen ? <div style={faqAnswerStyle}>{item.answer}</div> : null}
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
