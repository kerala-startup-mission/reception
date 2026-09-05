export const WEBHOOK_URL = 'https://api.startupmission.in/webhook/reception'

// requirement is stored as the canonical English value regardless of UI language
export function buildPayload(form) {
  return new URLSearchParams({
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    organisation: form.organisation.trim(),
    requirement: form.requirement,
  })
}

// The webhook answers 200 {message:"Success", id, token:"V105"}
// and 4xx {message:"Error", error:"Invalid phone number format: ..."}.
// `data` is null when the body was not JSON at all (proxy error pages, timeouts).
export function readResponse(ok, data) {
  if (ok) return { ok: true, token: typeof data?.token === 'string' ? data.token : '' }
  return { ok: false, error: typeof data?.error === 'string' ? data.error : '' }
}
