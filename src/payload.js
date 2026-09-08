const API = 'https://api.startupmission.in/webhook'

export const WEBHOOK_URL = `${API}/reception`
export const TOKEN_URL = `${API}/reception/token`

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

// Lookup answers 200 {token, name, requirement, visitType, company} or 404.
export function readVisit(ok, data) {
  if (!ok || !data?.token) return { found: false }
  return {
    found: true,
    token: data.token,
    name: data.name ?? '',
    requirement: data.requirement ?? '',
    visitType: data.visitType ?? '',
    company: data.company ?? '',
  }
}
