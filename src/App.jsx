import { useEffect, useState } from 'react'
import { COPY, PURPOSES } from './copy'
import { buildPayload, readResponse, WEBHOOK_URL } from './payload'

const ORG_NAME = 'Kerala Startup Mission'
const EMPTY = { name: '', email: '', phone: '', organisation: '' }

const Corners = () => (
  <>
    <i className="corner tl" />
    <i className="corner tr" />
    <i className="corner bl" />
    <i className="corner br" />
  </>
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
  const [lang, setLang] = useState(null)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY)
  const [purpose, setPurpose] = useState(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [refNo, setRefNo] = useState('')

  const t = COPY[lang ?? 'en']
  const isML = lang === 'ml'

  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setError('')
  }

  function reset() {
    setLang(null)
    setStep(0)
    setForm(EMPTY)
    setPurpose(null)
    setError('')
    setRefNo('')
  }

  function next() {
    if (step === 1 && (!form.name.trim() || (!form.phone.trim() && !form.email.trim())))
      return setError(t.reqDetails)
    if (step === 2 && purpose === null) return setError(t.reqPurpose)
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
        body: buildPayload({ ...form, requirement: PURPOSES[purpose] }),
      })
      const data = await res.json().catch(() => null)
      const out = readResponse(res.ok, data)
      if (!out.ok) return setError(out.error || t.sendFailed)
      setRefNo(out.token || '\u2014')
      setStep(4)
    } catch {
      setError(t.sendFailed)
    } finally {
      setSending(false)
    }
  }

  const purposeLabel = purpose === null ? '—' : t.labels[PURPOSES[purpose]]

  const StepHead = ({ kicker, title, sub }) => (
    <>
      {/* <div className="dr-step">{kicker}</div> */}
      {/* <div className="mx-0 mt-3 mb-[22px] h-px bg-[var(--color-divider)]" /> */}
      <h1 className="dr-head">{title}</h1>
      <p className="dr-sub">{sub}</p>
    </>
  )

  const Error = () =>
    error && (
      <div
        role="alert"
        className="mt-5 border-l-2 border-[var(--color-accent)] pl-3 text-sm font-semibold text-[var(--color-accent-800)]"
      >
        {error}
      </div>
    )

  const Actions = ({ onNext, label }) => (
    <div className="mt-[34px] flex flex-wrap gap-3">
      <button type="button" className="btn btn-ghost flex-1 sm:flex-none" onClick={back}>
        {t.back}
      </button>
      <button
        type="button"
        className="btn btn-primary blueprint flex-1 sm:flex-none"
        onClick={onNext}
        disabled={sending}
      >
        <Corners />
        {label}
      </button>
    </div>
  )

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
          const active = i === Math.min(step, 3)
          const past = i < step
          return (
            <div
              key={label}
              className={`flex min-w-0 flex-1 flex-col items-start gap-[3px] pt-2 pb-2.5 sm:flex-row sm:items-baseline sm:gap-2.5 sm:pt-2.5 sm:pb-3 ${
                active ? 'border-t-2 border-[var(--color-accent)]' : 'border-t-2 border-[var(--color-divider)]'
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
          {step === 0 && (
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
                <button
                  type="button"
                  onClick={() => {
                    setLang('en')
                    setStep(1)
                  }}
                  className="blueprint flex min-h-[108px] cursor-pointer flex-col justify-center gap-2 bg-transparent px-[18px] py-5 text-left hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-100)] sm:min-h-[150px] sm:px-[26px] sm:py-[30px]"
                >
                  <Corners />
                  <span
                    className="text-[40px] leading-none font-semibold uppercase"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    English
                  </span>
                  <span className="text-[13px] tracking-[0.1em] text-[var(--color-neutral-700)] uppercase">
                    Continue in English
                  </span>
                </button>
                <button
                  type="button"
                  lang="ml"
                  onClick={() => {
                    setLang('ml')
                    setStep(1)
                  }}
                  className="blueprint flex min-h-[108px] cursor-pointer flex-col justify-center gap-2 bg-transparent px-[18px] py-5 text-left hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-100)] sm:min-h-[150px] sm:px-[26px] sm:py-[30px]"
                  style={{ fontFamily: 'var(--font-ml)' }}
                >
                  <Corners />
                  <span className="text-4xl leading-[1.15] font-semibold">മലയാളം</span>
                  <span className="text-sm text-[var(--color-neutral-700)]">
                    മലയാളത്തിൽ തുടരുക
                  </span>
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <StepHead kicker={t.stepTwo} title={t.detailsTitle} sub={t.detailsSub} />
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-[22px] gap-y-[18px]">
                <label className="block">
                  <span className="dr-label">{t.name}</span>
                  <input
                    className="input"
                    value={form.name}
                    onChange={set('name')}
                    placeholder={t.namePh}
                    autoFocus
                  />
                </label>
                <label className="block">
                  <span className="dr-label">{t.phone}</span>
                  <input
                    className="input"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder={t.phonePh}
                  />
                </label>
                <label className="block">
                  <span className="dr-label">{t.email}</span>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder={t.emailPh}
                  />
                </label>
                <label className="block">
                  <span className="dr-label">{t.org}</span>
                  <input
                    className="input"
                    value={form.organisation}
                    onChange={set('organisation')}
                    placeholder={t.orgPh}
                  />
                </label>
              </div>
              <Error />
              <Actions onNext={next} label={t.continue} />
            </div>
          )}

          {step === 2 && (
            <div>
              <StepHead kicker={t.stepThree} title={t.purposeTitle} sub={t.purposeSub} />
              <div className="mt-[30px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-3.5">
                {PURPOSES.map((p, i) => {
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
                        {t.notes[i]}
                      </span>
                    </button>
                  )
                })}
              </div>
              <Error />
              <Actions onNext={next} label={t.continue} />
            </div>
          )}

          {step === 3 && (
            <div>
              <StepHead kicker={t.stepFour} title={t.reviewTitle} sub={t.reviewSub} />
              <div className="blueprint mt-[30px]">
                <Corners />
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--color-divider)] px-5 py-3.5">
                  <span
                    className="text-[15px] font-semibold tracking-[0.08em] uppercase"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t.sheet}
                  </span>
                  <span className="text-xs tracking-[0.1em] tabular-nums text-[var(--color-neutral-700)]">
                    {refNo || '—'}
                  </span>
                </div>
                {[
                  [t.keys[0], form.name],
                  [t.keys[1], form.phone],
                  [t.keys[2], form.email],
                  [t.keys[3], form.organisation],
                  [t.keys[4], purposeLabel],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="grid grid-cols-[minmax(120px,34%)_1fr] gap-4 border-b border-[var(--color-divider)] px-5 py-[13px]"
                  >
                    <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-neutral-700)]">
                      {k}
                    </span>
                    <span className="text-base leading-[1.4] font-medium">{v || '—'}</span>
                  </div>
                ))}
              </div>
              <Error />
              <Actions onNext={submit} label={sending ? t.checkingIn : t.checkIn} />
            </div>
          )}

          {step === 4 && (
            <div>
              <StepHead kicker={t.confirmed} title={t.thanks} sub={t.doneSub} />
              <div className="blueprint mt-[30px] flex flex-wrap items-center gap-[30px] px-[26px] py-[30px]">
                <Corners />
                <div>
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--color-neutral-700)]">
                    {t.token}
                  </div>
                  <div
                    className="text-[64px] leading-none tracking-[0.02em] tabular-nums"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {refNo}
                  </div>
                </div>
                <div className="w-px self-stretch bg-[var(--color-divider)]" />
                <div className="min-w-[200px] flex-1 text-[15px] leading-[1.55]">
                  <div className="font-semibold">{form.name}</div>
                  <div className="text-[var(--color-neutral-700)]">{purposeLabel}</div>
                </div>
              </div>
              <div className="mt-[34px] flex gap-3">
                <button type="button" className="btn btn-secondary" onClick={reset}>
                  {t.newVisitor}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
