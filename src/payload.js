const API = 'https://api.startupmission.in/webhook'

export const WEBHOOK_URL = `${API}/reception`
export const TOKEN_URL = `${API}/reception/token`
export const ESCALATE_URL = `${API}/reception/escalate`

// A KSUM visitor can nudge reception once this much of their wait has passed.
export const ESCALATE_AFTER_SECONDS = 15 * 60

// requirement is the canonical English value regardless of UI language, except
// on the "Other" branch where it carries the visitor's own words.
// company is empty for KSUM visits.
export function buildPayload(form) {
  return new URLSearchParams({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    organisation: form.organisation.trim(),
    requirement: form.requirement,
    visitType: form.visitType,
    company: (form.company ?? '').trim(),
  })
}

// Check-in answers 200 {message:"Success", id:"<uuid>"} and 4xx
// {message:"Error", error:"..."}. The token is no longer part of this response;
// the row is appended before we are answered, so it is looked up separately.
// `data` is null when the body was not JSON (proxy error pages, timeouts).
export function readResponse(ok, data) {
  if (ok) return { ok: true, id: typeof data?.id === 'string' ? data.id : '' }
  return { ok: false, error: typeof data?.error === 'string' ? data.error : '' }
}

// Lookup answers 200 {token, name, requirement, visitType, company, owner,
// waitSeconds, escalatedAt} or 404. `owner` is the KSUM staff member who owns
// this enquiry type, and is null for incubated-company visits and for purposes
// with no row yet.
export function readVisit(ok, data) {
  if (!ok || !data?.token) return { found: false }
  return {
    found: true,
    token: data.token,
    name: data.name ?? '',
    requirement: data.requirement ?? '',
    visitType: data.visitType ?? '',
    company: data.company ?? '',
    // Key off the name: a row half-filled in the Data Table would otherwise
    // render an empty contact card at a visitor.
    owner: data.owner?.name ? data.owner : null,
    // Seconds already waited, measured server-side from the check-in row. A
    // missing value starts a fresh countdown rather than unlocking the button
    // immediately, which covers rows written before the timestamp column.
    waitSeconds: Number.isFinite(data.waitSeconds) ? data.waitSeconds : 0,
    // The sheet is the source of truth for "already nudged", so this survives
    // a reload and a different device in a way client storage would not.
    escalated: Boolean(data.escalatedAt),
  }
}

// Seconds remaining as m:ss. Negative clamps to 0:00 so a late tick can never
// render something like -0:01.
export function formatCountdown(seconds) {
  const left = Math.max(0, Math.ceil(seconds))
  const mins = Math.floor(left / 60)
  return `${mins}:${String(left - mins * 60).padStart(2, '0')}`
}
