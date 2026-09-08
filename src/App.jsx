import { useCallback, useEffect, useState } from 'react'
import { COPY, PURPOSES, VISIT_TYPES } from './copy'
import { buildPayload, readResponse, readVisit, TOKEN_URL, WEBHOOK_URL } from './payload'

const ORG_NAME = 'Kerala Startup Mission'
const EMPTY = { name: '', email: '', phone: '', organisation: '', company: '' }

const STEP = { LANG: 0, VISIT: 1, PURPOSE: 2, DETAILS: 3, REVIEW: 4, DONE: 5 }

const idFromUrl = () => new URLSearchParams(window.location.search).get('id') || ''

const Corners = () => (
  <>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
  </>
)

// The language and visit-type screens are the same object: two big blueprint
// cards, a headline and a sub-line each.
function ChoiceCard({ onClick, title, note, lang, headingFont }) {
  return (
    <button
      type="button"
      lang={lang}
      onClick={onClick}
      className="blueprint flex min-h-[108px] cursor-pointer flex-col justify-center gap-2 bg-transparent px-[18px] py-5 text-left hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-100)] sm:min-h-[150px] sm:px-[26px] sm:py-[30px]"
      style={lang === 'ml' ? { fontFamily: 'var(--font-ml)' } : null}
    >
      <Corners />
      <span
        className={
          lang === 'ml'
            ? 'text-4xl leading-[1.15] font-semibold'
            : 'text-[40px] leading-none font-semibold uppercase'
        }
        style={headingFont ? { fontFamily: 'var(--font-heading)' } : null}
      >
        {title}
      </span>
      <span
        className={
          lang === 'ml'
            ? 'text-sm text-[var(--color-neutral-700)]'
            : 'text-[13px] tracking-[0.1em] text-[var(--color-neutral-700)] uppercase'
        }
      >
        {note}
      </span>
    </button>
  )
}

// Defined at module scope, not inside App: a component declared in the render
// body is a new type every render, so React would remount the <input> Field
// wraps on every keystroke and the field would lose focus after one character.
const StepHead = ({ title, sub }) => (
  <>
    <h1 className="dr-head">{title}</h1>
    <p className="dr-sub">{sub}</p>
  </>
)

const Field = ({ label, children }) => (
  <label className="block">
    <span className="dr-label">{label}</span>
    {children}
  </label>
)

const Alert = ({ children }) =>
  children && (
    <div
      role="alert"
      className="mt-5 border-l-2 border-[var(--color-accent)] pl-3 text-sm font-semibold text-[var(--color-accent-800)]"
    >
      {children}
    </div>
  )

const Actions = ({ onBack, onNext, backLabel, label, disabled }) => (
  <div className="mt-[34px] flex flex-wrap gap-3">
    <button type="button" className="btn btn-ghost flex-1 sm:flex-none" onClick={onBack}>
      {backLabel}
    </button>
    <button
      type="button"
      className="btn btn-primary blueprint flex-1 sm:flex-none"
      onClick={onNext}
      disabled={disabled}
    >
      <Corners />
      {label}
    </button>
  </div>
)

function Clock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 20000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex min-w-0 flex-row flex-wrap items-baseline gap-x-2.5 sm:flex-col sm:items-end sm:gap-y-[3px]">
      <div
        className="text-xl leading-none tracking-[0.02em] tabular-nums sm:text-[26px]"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs tracking-[0.04em] text-[var(--color-accent-400)] sm:text-[13px]">
        {now.toLocaleDateString([], {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </div>
    </div>
  )
}

export default function App() {
  // A page opened at ?id=... is a token page: jump straight to the done screen
  // and let the lookup effect fill it in.
  const [visitId, setVisitId] = useState(idFromUrl)
  const [lang, setLang] = useState(null)
  const [step, setStep] = useState(() => (idFromUrl() ? STEP.DONE : STEP.LANG))
  const [visitType, setVisitType] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [purpose, setPurpose] = useState(null)
  const [otherReason, setOtherReason] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [visit, setVisit] = useState(null)

  const t = COPY[lang ?? 'en']
  const isML = lang === 'ml'
  const isIncubated = visitType === 'Incubated Company'
  const purposes = visitType ? PURPOSES[visitType] : []
  const purposeValue = purpose === null ? null : purposes[purpose]
  const requirement = purposeValue === 'Other' ? otherReason.trim() : purposeValue

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setError('')
  }

  // One lookup path for both a fresh check-in and a reopened link.
  useEffect(() => {
    if (!visitId) return
    let live = true
    setVisit(null)
    fetch(`${TOKEN_URL}?id=${encodeURIComponent(visitId)}`)
      .then(async (res) => readVisit(res.ok, await res.json().catch(() => null)))
      .catch(() => ({ found: false }))
      .then((v) => live && setVisit(v))
    return () => {
      live = false
    }
  }, [visitId])

  const reset = useCallback(() => {
    window.history.replaceState(null, '', window.location.pathname)
    setVisitId('')
    setVisit(null)
    setLang(null)
    setStep(STEP.LANG)
    setVisitType(null)
    setForm(EMPTY)
    setPurpose(null)
    setOtherReason('')
    setError('')
  }, [])

  function next() {
    if (step === STEP.DETAILS) {
      if (!form.name.trim() || !form.phone.trim() || !form.email.trim())
        return setError(t.reqDetails)
      if (isIncubated && !form.company.trim()) return setError(t.reqCompany)
    }
    if (step === STEP.PURPOSE) {
      if (purpose === null) return setError(t.reqPurpose)
      if (purposeValue === 'Other' && !otherReason.trim()) return setError(t.reqOther)
    }
    setStep(step + 1)
    setError('')
  }

  const back = () => {
    setStep((s) => Math.max(0, s - 1))
    setError('')
  }

  async function submit() {
    setSending(true)
    setError('')
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: buildPayload({ ...form, requirement, visitType }),
      })
      const out = readResponse(res.ok, await res.json().catch(() => null))
      if (!out.ok) return setError(out.error || t.sendFailed)
      window.history.replaceState(null, '', `?id=${encodeURIComponent(out.id)}`)
      setVisitId(out.id)
      setStep(STEP.DONE)
    } catch {
      setError(t.sendFailed)
    } finally {
      setSending(false)
    }
  }

  const purposeLabel = (value) => (value ? (t.labels[value] ?? value) : '—')

  return (
    <div
      lang={isML ? 'ml' : 'en'}
      className="flex min-h-dvh flex-col bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <header className="flex flex-col flex-wrap items-start justify-between gap-3.5 bg-[var(--color-accent-900)] px-[18px] py-3.5 text-[#f2f2f3] sm:flex-row sm:items-center sm:px-7 sm:py-4 lg:px-[clamp(32px,4vw,72px)]">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3.5">
          <div
            className="text-xl leading-[1.05] tracking-[0.06em] uppercase sm:text-2xl lg:text-[27px]"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}
          >
            {ORG_NAME}
          </div>
          <div className="text-[11px] font-semibold tracking-[0.14em] text-[var(--color-accent-300)] uppercase">
            {t.kicker}
          </div>
        </div>
        <Clock />
      </header>

      <nav className="flex gap-1.5 border-b border-[var(--color-divider)] px-[18px] sm:gap-2.5 sm:px-7 lg:px-[clamp(32px,4vw,72px)]">
        {t.rail.map((label, i) => {
          const active = i === Math.min(step, STEP.REVIEW)
          const past = i < step
          return (
            <div
              key={label}
              className={`flex min-w-0 flex-1 flex-col items-start gap-[3px] border-t-2 pt-2 pb-2.5 sm:flex-row sm:items-baseline sm:gap-2.5 sm:pt-2.5 sm:pb-3 ${
                active ? 'border-[var(--color-accent)]' : 'border-[var(--color-divider)]'
              }`}
            >
              <span
                className={`text-[11px] font-semibold tracking-[0.1em] tabular-nums sm:text-xs ${
                  active
                    ? 'text-[var(--color-accent-700)]'
                    : past
                      ? 'text-[var(--color-neutral-700)]'
                      : 'text-[var(--color-neutral-500)]'
                }`}
              >
                0{i + 1}
              </span>
              <span
                className={`dr-rail-label text-xs leading-tight font-semibold tracking-[0.06em] uppercase sm:text-lg ${
                  active
                    ? 'text-[var(--color-text)]'
                    : past
                      ? 'text-[var(--color-neutral-700)]'
                      : 'text-[var(--color-neutral-500)]'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </nav>

      <main className="flex flex-1 items-start px-[18px] pt-[26px] pb-10 sm:px-7 sm:pt-10 sm:pb-14 lg:items-center lg:px-[clamp(32px,4vw,72px)] lg:py-[clamp(36px,5vw,72px)]">
        <div
          key={step}
          className="mx-auto w-full max-w-[760px]"
          style={{ animation: 'dr-in 320ms ease-out' }}
        >
          {step === STEP.LANG && (
            <div>
              <h1 className="dr-head">{COPY.en.langTitle}</h1>
              <p
                lang="ml"
                className="mt-0 mb-[34px] text-[clamp(24px,3.2vw,34px)] leading-[1.35] text-[var(--color-accent-800)]"
                style={{ fontFamily: 'var(--font-ml)' }}
              >
                {COPY.ml.langTitle}
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                <ChoiceCard
                  headingFont
                  title="English"
                  note="Continue in English"
                  onClick={() => {
                    setLang('en')
                    setStep(STEP.VISIT)
                  }}
                />
                <ChoiceCard
                  lang="ml"
                  title="മലയാളം"
                  note="മലയാളത്തിൽ തുടരുക"
                  onClick={() => {
                    setLang('ml')
                    setStep(STEP.VISIT)
                  }}
                />
              </div>
            </div>
          )}

          {step === STEP.VISIT && (
            <div>
              <StepHead title={t.visitTitle} sub={t.visitSub} />
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                {VISIT_TYPES.map((v) => (
                  <ChoiceCard
                    key={v}
                    headingFont
                    lang={isML ? 'ml' : undefined}
                    title={t.visitLabels[v]}
                    note={t.visitNotes[v]}
                    onClick={() => {
                      setVisitType(v)
                      setPurpose(null)
                      setOtherReason('')
                      setStep(STEP.PURPOSE)
                    }}
                  />
                ))}
              </div>
              <div className="mt-[34px] flex flex-wrap gap-3">
                <button type="button" className="btn btn-ghost" onClick={back}>
                  {t.back}
                </button>
              </div>
            </div>
          )}

          {step === STEP.DETAILS && (
            <div>
              <StepHead title={t.detailsTitle} sub={t.detailsSub} />
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-[22px] gap-y-[18px]">
                <Field label={t.name}>
                  <input
                    className="input"
                    value={form.name}
                    onChange={set('name')}
                    placeholder={t.namePh}
                    autoFocus
                  />
                </Field>
                <Field label={t.phone}>
                  <input
                    className="input"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder={t.phonePh}
                  />
                </Field>
                <Field label={t.email}>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder={t.emailPh}
                  />
                </Field>
                <Field label={t.org}>
                  <input
                    className="input"
                    value={form.organisation}
                    onChange={set('organisation')}
                    placeholder={t.orgPh}
                  />
                </Field>
                {isIncubated && (
                  <Field label={t.company}>
                    <input
                      className="input"
                      value={form.company}
                      onChange={set('company')}
                      placeholder={t.companyPh}
                    />
                  </Field>
                )}
              </div>
              <Alert>{error}</Alert>
              <Actions
                onBack={back}
                onNext={next}
                backLabel={t.back}
                label={t.continue}
                disabled={sending}
              />
            </div>
          )}

          {step === STEP.PURPOSE && (
            <div>
              <StepHead title={t.purposeTitle} sub={t.purposeSub} />
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
                {purposes.map((p, i) => {
                  const on = purpose === i
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPurpose(i)
                        setError('')
                      }}
                      className={`blueprint flex min-h-[132px] cursor-pointer flex-col justify-start gap-[7px] px-[18px] py-5 text-left transition-colors duration-150 ${
                        on
                          ? 'border-[var(--color-accent-900)] bg-[var(--color-accent-900)] text-[#f2f2f3]'
                          : 'bg-transparent text-[var(--color-text)]'
                      }`}
                    >
                      <Corners />
                      <span className="text-xs font-semibold tracking-[0.12em] tabular-nums opacity-[0.72]">
                        0{i + 1}
                      </span>
                      <span
                        className="dr-purpose-title text-[26px] leading-[1.05] font-semibold tracking-[0.01em] uppercase"
                        style={{
                          fontFamily: isML ? 'var(--font-ml)' : 'var(--font-heading)',
                          ...(isML ? { fontSize: 20, lineHeight: 1.3 } : null),
                        }}
                      >
                        {t.labels[p]}
                      </span>
                      <span className="text-[13px] leading-[1.45] opacity-[0.78]">
                        {t.notes[p]}
                      </span>
                    </button>
                  )
                })}
              </div>
              {purposeValue === 'Other' && (
                <div className="mt-[18px]">
                  <input
                    className="input"
                    value={otherReason}
                    onChange={(e) => {
                      setOtherReason(e.target.value)
                      setError('')
                    }}
                    placeholder={t.otherPh}
                    autoFocus
                  />
                </div>
              )}
              <Alert>{error}</Alert>
              <Actions
                onBack={back}
                onNext={next}
                backLabel={t.back}
                label={t.continue}
                disabled={sending}
              />
            </div>
          )}

          {step === STEP.REVIEW && (
            <div>
              <StepHead title={t.reviewTitle} sub={t.reviewSub} />
              <div className="blueprint mt-[30px]">
                <Corners />
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-divider)] px-5 py-3.5">
                  <span
                    className="text-[15px] font-semibold tracking-[0.08em] uppercase"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t.sheet}
                  </span>
                </div>
                {[
                  [t.keys.visit, t.visitLabels[visitType]],
                  [t.keys.name, form.name],
                  [t.keys.phone, form.phone],
                  [t.keys.email, form.email],
                  [t.keys.org, form.organisation],
                  ...(isIncubated ? [[t.keys.company, form.company]] : []),
                  [t.keys.purpose, purposeValue === 'Other' ? requirement : purposeLabel(purposeValue)],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[minmax(120px,34%)_1fr] gap-4 border-b border-[var(--color-divider)] px-5 py-[13px]"
                  >
                    <span className="text-xs font-semibold tracking-[0.1em] text-[var(--color-neutral-700)] uppercase">
                      {k}
                    </span>
                    <span className="text-base leading-[1.4] font-medium">{v || '—'}</span>
                  </div>
                ))}
              </div>
              <Alert>{error}</Alert>
              <Actions
                onBack={back}
                onNext={submit}
                backLabel={t.back}
                label={sending ? t.checkingIn : t.checkIn}
                disabled={sending}
              />
            </div>
          )}

          {step === STEP.DONE && (
            <div>
              {visit === null && <p className="dr-sub">{t.loadingToken}</p>}

              {visit?.found === false && (
                <>
                  <StepHead title={t.notFoundTitle} sub={t.notFoundSub} />
                  <div className="mt-[34px] flex gap-3">
                    <button type="button" className="btn btn-secondary" onClick={reset}>
                      {t.newVisitor}
                    </button>
                  </div>
                </>
              )}

              {visit?.found && (
                <>
                  <StepHead
                    title={t.thanks}
                    sub={
                      visit.visitType === 'Incubated Company'
                        ? t.doneSubIncubated
                        : t.doneSub
                    }
                  />
                  <div className="blueprint mt-[30px] flex flex-wrap items-center gap-[30px] px-[26px] py-[30px]">
                    <Corners />
                    <div>
                      <div className="text-xs font-semibold tracking-[0.12em] text-[var(--color-neutral-700)] uppercase">
                        {t.token}
                      </div>
                      <div
                        className="text-[64px] leading-none tracking-[0.02em] tabular-nums"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {visit.token}
                      </div>
                    </div>
                    <div className="w-px self-stretch bg-[var(--color-divider)]" />
                    <div className="min-w-[200px] flex-1 text-[15px] leading-[1.55]">
                      <div className="font-semibold">{visit.name}</div>
                      <div className="text-[var(--color-neutral-700)]">
                        {purposeLabel(visit.requirement)}
                      </div>
                      {visit.company && (
                        <div className="text-[var(--color-neutral-700)]">{visit.company}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-[34px] flex gap-3">
                    <button type="button" className="btn btn-secondary" onClick={reset}>
                      {t.newVisitor}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
