import { useCallback, useEffect, useRef, useState } from 'react'
import './HomeFormModal.css'

const WA = 'https://wa.me/923342651544'
const STEP_TITLES = [
  'Personal Info',
  'Your Industry',
  'Requirements',
  'Timeline & Budget',
] as const
const TOTAL_STEPS = 4

type HomeFormModalProps = {
  open: boolean
  onClose: () => void
}

export function HomeFormModal({ open, onClose }: HomeFormModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedReqs, setSelectedReqs] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [biz, setBiz] = useState('')
  const [idea, setIdea] = useState('')
  const [source, setSource] = useState('')
  const [waHref, setWaHref] = useState(WA)
  const [deadlineSummary, setDeadlineSummary] = useState('Not specified')
  const [budgetSummary, setBudgetSummary] = useState('Not specified')

  const reset = useCallback(() => {
    setStep(1)
    setSubmitted(false)
    setSelectedIndustry('')
    setSelectedReqs([])
    setName('')
    setEmail('')
    setPhone('')
    setCompany('')
    setBiz('')
    setIdea('')
    setSource('')
    setWaHref(WA)
    setDeadlineSummary('Not specified')
    setBudgetSummary('Not specified')
  }, [])

  useEffect(() => {
    if (!open) {
      reset()
      return
    }
    setStep(1)
    setSubmitted(false)
  }, [open, reset])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const scrollBodyTop = () => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
  }

  const goToStep = (n: number) => {
    setStep(n)
    scrollBodyTop()
  }

  const shakeModal = () => {
    const el = document.querySelector('.form-modal')
    if (!el || !(el instanceof HTMLElement)) return
    el.style.animation = 'none'
    el.style.transform = 'translateX(-8px)'
    setTimeout(() => {
      el.style.transform = 'translateX(8px)'
    }, 80)
    setTimeout(() => {
      el.style.transform = 'translateX(-5px)'
    }, 160)
    setTimeout(() => {
      el.style.transform = 'translateX(0)'
      el.style.animation = ''
    }, 240)
  }

  const toggleReq = (label: string) => {
    setSelectedReqs((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    )
  }

  const submitForm = () => {
    const deadline =
      (
        document.querySelector(
          'input[name="home-deadline"]:checked',
        ) as HTMLInputElement | null
      )?.value ?? 'Not specified'
    const budget =
      (
        document.querySelector(
          'input[name="home-budget"]:checked',
        ) as HTMLInputElement | null
      )?.value ?? 'Not specified'

    setDeadlineSummary(deadline)
    setBudgetSummary(budget)
    setSubmitted(true)
    scrollBodyTop()

    const msg = `Hi Suneel Pirkash! I just submitted a custom project request on your website.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Phone:* ${encodeURIComponent(phone || 'N/A')}%0A*Industry:* ${encodeURIComponent(selectedIndustry || 'N/A')}%0A*Requirements:* ${encodeURIComponent(selectedReqs.join(', ') || 'N/A')}%0A*Deadline:* ${encodeURIComponent(deadline)}%0A*Budget:* ${encodeURIComponent(budget)}`
    setWaHref(`${WA}?text=${msg}`)
  }

  const nextStep = () => {
    if (step === 1) {
      if (!name.trim() || !email.trim()) {
        shakeModal()
        return
      }
    }
    if (step === 3) {
      if (!idea.trim()) {
        shakeModal()
        return
      }
    }
    if (step === TOTAL_STEPS) {
      submitForm()
      return
    }
    goToStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) goToStep(step - 1)
  }

  const overlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const progressPct =
    submitted ? 100 : ((step - 1) / (TOTAL_STEPS - 1)) * 100

  if (!open) return null

  return (
    <div
      className="form-overlay show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-form-heading"
      onClick={overlayClick}
    >
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="form-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 id="home-form-heading" className="home-form-sr-heading">
          Start your project
        </h2>

        {!submitted ? (
          <>
            <div className="form-modal-header">
              <div className="form-progress">
                <div
                  className="form-progress-bar"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="form-steps-label">
                <span>
                  Step {step} of {TOTAL_STEPS}
                </span>
                <span>{STEP_TITLES[step - 1]}</span>
              </div>
              <div className="step-dots">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`step-dot${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-modal-body" ref={bodyRef}>
              <div className={`form-step${step === 1 ? ' active' : ''}`}>
                <div className="step-icon">👋</div>
                <h3>Let&apos;s get to know you</h3>
                <p>Tell us a little about yourself so we can get in touch.</p>
                <div className="fi-group">
                  <label>
                    Full Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Smith"
                    autoComplete="name"
                  />
                </div>
                <div className="fi-group">
                  <label>
                    Email Address <span>*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@yourbusiness.com"
                    autoComplete="email"
                  />
                </div>
                <div className="fi-group">
                  <label>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    autoComplete="tel"
                  />
                </div>
                <div className="fi-group">
                  <label>Company / Business Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company name (optional)"
                  />
                </div>
              </div>

              <div className={`form-step${step === 2 ? ' active' : ''}`}>
                <div className="step-icon">🏢</div>
                <h3>What&apos;s your business about?</h3>
                <p>
                  Select your industry so we can tailor the best solution for
                  you.
                </p>
                <div className="industry-grid">
                  {(
                    [
                      ['Healthcare', '🏥'],
                      ['eCommerce', '🛒'],
                      ['Real Estate', '🏠'],
                      ['Restaurant / Food', '🍽️'],
                      ['Agency / Freelancer', '💼'],
                      ['Education', '📚'],
                      ['Finance / Legal', '⚖️'],
                      ['Other', '✨'],
                    ] as const
                  ).map(([label, icon]) => (
                    <button
                      key={label}
                      type="button"
                      className={`ind-card${selectedIndustry === label ? ' selected' : ''}`}
                      onClick={() => setSelectedIndustry(label)}
                    >
                      {icon}
                      <br />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="fi-group" style={{ marginTop: 16 }}>
                  <label>Brief description of your business</label>
                  <textarea
                    id="f_biz"
                    value={biz}
                    onChange={(e) => setBiz(e.target.value)}
                    placeholder="What does your business do? Who are your customers?"
                    rows={3}
                  />
                </div>
              </div>

              <div className={`form-step${step === 3 ? ' active' : ''}`}>
                <div className="step-icon">📋</div>
                <h3>What do you need?</h3>
                <p>Select everything that applies to your project.</p>
                <div className="req-grid">
                  {[
                    '🌐 New Website',
                    '🛒 Online Store',
                    '🔍 SEO Optimization',
                    '📱 Social Media',
                    '🎨 Logo & Branding',
                    '📧 Email Marketing',
                    '🎯 Google / Meta Ads',
                    '🔧 Website Redesign',
                    '📲 Mobile App',
                    '🎬 Video Editing',
                    '🛡️ Maintenance',
                    '💳 Payment Integration',
                  ].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`req-chip${selectedReqs.includes(t) ? ' selected' : ''}`}
                      onClick={() => toggleReq(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="fi-group" style={{ marginTop: 20 }}>
                  <label>
                    Describe your project idea <span>*</span>
                  </label>
                  <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Tell us what you have in mind — the more detail the better!"
                    rows={4}
                  />
                </div>
              </div>

              <div className={`form-step${step === 4 ? ' active' : ''}`}>
                <div className="step-icon">🗓️</div>
                <h3>Timeline & Budget</h3>
                <p>
                  Help us understand your deadline and budget so we can plan
                  accordingly.
                </p>
                <div className="fi-group">
                  <label>What&apos;s your deadline?</label>
                  <div className="radio-group">
                    {(
                      [
                        ['ASAP', '🔥 ASAP (within 1 week)'],
                        ['2 weeks', '⚡ 2 weeks'],
                        ['1 month', '📅 1 month'],
                        ['Flexible', '😊 Flexible — no rush'],
                      ] as const
                    ).map(([val, lab]) => (
                      <label key={val} className="radio-opt">
                        <input type="radio" name="home-deadline" value={val} />{' '}
                        <span>{lab}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fi-group">
                  <label>Approximate Budget</label>
                  <div className="radio-group">
                    {(
                      [
                        ['Under $200', '💰 Under $200'],
                        ['$200–$500', '💰 $200 – $500'],
                        ['$500–$1000', '💰 $500 – $1,000'],
                        ['$1000+', '💰 $1,000+'],
                      ] as const
                    ).map(([val, lab]) => (
                      <label key={val} className="radio-opt">
                        <input type="radio" name="home-budget" value={val} />{' '}
                        <span>{lab}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fi-group">
                  <label>How did you hear about us?</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="">Select an option</option>
                    <option>Google Search</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>WhatsApp</option>
                    <option>Referral / Friend</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-nav">
              <button
                type="button"
                className="btn-back"
                onClick={prevStep}
                style={{ display: step > 1 ? 'block' : 'none' }}
              >
                ← Back
              </button>
              <button type="button" className="btn-next" onClick={nextStep}>
                {step === TOTAL_STEPS ? 'Submit Project →' : 'Continue →'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="form-modal-header">
              <div className="form-progress">
                <div className="form-progress-bar" style={{ width: '100%' }} />
              </div>
              <div className="form-steps-label">
                <span>Complete</span>
                <span>Thank you</span>
              </div>
            </div>
            <div className="form-modal-body" ref={bodyRef}>
              <div className="form-step active">
                <div className="success-anim">🎉</div>
                <h3>We got your request!</h3>
                <p>
                  Thank you! Suneel Pirkash will review your project and get
                  back to you within{' '}
                  <strong style={{ color: '#fff' }}>24 hours</strong>.
                </p>
                <div className="success-summary">
                  <strong style={{ color: '#ffffff' }}>📋 Summary</strong>
                  <br />
                  👤 {name} &nbsp;·&nbsp; 📧 {email}
                  <br />
                  🏢 Industry: {selectedIndustry || 'Not selected'}
                  <br />
                  ✅ Needs:{' '}
                  {selectedReqs.slice(0, 3).join(', ') || 'Custom project'}
                  <br />⏱ {deadlineSummary} &nbsp;·&nbsp; 💰 {budgetSummary}
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wa-btn-inline"
                >
                  💬 Message on WhatsApp now
                </a>
              </div>
            </div>
            <div className="form-nav">
              <button type="button" className="btn-next" onClick={onClose}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
