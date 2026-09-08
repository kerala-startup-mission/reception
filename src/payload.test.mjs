import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPayload, formatCheckIn, formatCountdown, readResponse, readVisit } from './payload.js'

const ksum = {
  name: '  Test Entry ',
  email: 'admin@startupmission.in',
  phone: ' +919495513259',
  organisation: 'KSUM ',
  requirement: 'Financial Assistance',
  visitType: 'KSUM',
}

test('sends every field, trimmed', () => {
  const body = buildPayload(ksum)
  assert.deepEqual([...body.keys()].sort(), [
    'company',
    'email',
    'name',
    'organisation',
    'phone',
    'requirement',
    'visitType',
  ])
  assert.equal(body.get('name'), 'Test Entry')
  assert.equal(body.get('phone'), '+919495513259')
  assert.equal(body.get('organisation'), 'KSUM')
})

test('requirement stays English even when the UI is Malayalam', () => {
  // the Malayalam label is സാമ്പത്തിക സഹായം but the value sent is the English string
  const body = buildPayload(ksum)
  assert.equal(body.get('requirement'), 'Financial Assistance')
  assert.equal(body.toString().includes('requirement=Financial+Assistance'), true)
})

test('a KSUM visit carries the branch and an empty company', () => {
  const body = buildPayload(ksum)
  assert.equal(body.get('visitType'), 'KSUM')
  assert.equal(body.get('company'), '')
})

test('an incubated-company visit carries the company being visited', () => {
  const body = buildPayload({
    ...ksum,
    requirement: 'Meeting',
    visitType: 'Incubated Company',
    company: ' Acme Labs ',
  })
  assert.equal(body.get('visitType'), 'Incubated Company')
  assert.equal(body.get('company'), 'Acme Labs')
  assert.equal(body.get('requirement'), 'Meeting')
})

test('"Other" sends the typed reason, not the word Other', () => {
  // App.jsx resolves requirement before calling this; the wire must never say "Other"
  const body = buildPayload({
    ...ksum,
    visitType: 'Incubated Company',
    company: 'Acme Labs',
    requirement: 'Courier delivery',
  })
  assert.equal(body.get('requirement'), 'Courier delivery')
})

test('check-in success carries the id to redirect to', () => {
  const r = readResponse(true, { message: 'Success', id: '8551c2f3-ab1e' })
  assert.deepEqual(r, { ok: true, id: '8551c2f3-ab1e' })
})

test('check-in failure carries the API reason verbatim', () => {
  const r = readResponse(false, {
    message: 'Error',
    error: 'Invalid phone number format: Invalid country calling code',
  })
  assert.equal(r.ok, false)
  assert.equal(r.error, 'Invalid phone number format: Invalid country calling code')
})

test('non-JSON body leaves the caller to supply its own wording', () => {
  assert.deepEqual(readResponse(false, null), { ok: false, error: '' })
  assert.deepEqual(readResponse(true, null), { ok: true, id: '' })
})

test('a found visit yields the token and its details', () => {
  const v = readVisit(true, {
    token: 'V106',
    name: 'Test Entry',
    requirement: 'Meeting',
    visitType: 'Incubated Company',
    company: 'Acme Labs',
  })
  assert.equal(v.found, true)
  assert.equal(v.token, 'V106')
  assert.equal(v.company, 'Acme Labs')
})

test('a miss is not-found rather than a blank token', () => {
  // the done screen distinguishes "still loading" (null) from "no such id"
  assert.deepEqual(readVisit(false, { message: 'Error' }), { found: false })
  assert.deepEqual(readVisit(false, null), { found: false })
  assert.deepEqual(readVisit(true, { name: 'Test' }), { found: false })
})

test('a KSUM visit carries the enquiry owner', () => {
  const v = readVisit(true, {
    token: 'V106',
    name: 'Test Entry',
    requirement: 'Fab Lab',
    visitType: 'KSUM',
    company: '',
    owner: {
      name: 'Anjali Menon',
      designation: 'Manager, Fab Lab',
      email: 'anjali@startupmission.in',
    },
  })
  assert.equal(v.owner.name, 'Anjali Menon')
  assert.equal(v.owner.email, 'anjali@startupmission.in')
  // the owner's phone stays in the Data Table but is never sent to the page
  assert.equal(v.owner.phone, undefined)
})

test('an incubated-company visit has no KSUM owner', () => {
  const v = readVisit(true, {
    token: 'V107',
    name: 'Test Entry',
    requirement: 'Meeting',
    visitType: 'Incubated Company',
    company: 'Acme Labs',
    owner: null,
  })
  assert.equal(v.found, true)
  assert.equal(v.owner, null)
})

test('a half-filled owner row counts as no owner', () => {
  // the contact card is skipped entirely rather than rendered blank at a visitor
  const v = readVisit(true, {
    token: 'V108',
    name: 'Test Entry',
    requirement: 'Fab Lab',
    visitType: 'KSUM',
    owner: { name: '', designation: '', phone: '', email: '' },
  })
  assert.equal(v.owner, null)
})

test('the countdown renders as m:ss', () => {
  assert.equal(formatCountdown(900), '15:00')
  assert.equal(formatCountdown(754), '12:34')
  assert.equal(formatCountdown(9), '0:09')
  assert.equal(formatCountdown(0), '0:00')
})

test('a countdown past zero never renders negative', () => {
  // a late interval tick can overshoot; the button is showing by then anyway
  assert.equal(formatCountdown(-5), '0:00')
})

test('waitSeconds comes from the server, defaulting to a full wait', () => {
  const withWait = readVisit(true, { token: 'V106', visitType: 'KSUM', waitSeconds: 300 })
  assert.equal(withWait.waitSeconds, 300)

  // rows written before the timestamp column: start the 15 minutes fresh
  // rather than unlocking the button the moment the page opens
  assert.equal(readVisit(true, { token: 'V106' }).waitSeconds, 0)
  assert.equal(readVisit(true, { token: 'V106', waitSeconds: 'soon' }).waitSeconds, 0)
})

test('escalated is derived from the sheet, not from the client', () => {
  assert.equal(readVisit(true, { token: 'V106', escalatedAt: '2026-09-08 14:30:00' }).escalated, true)
  assert.equal(readVisit(true, { token: 'V106', escalatedAt: '' }).escalated, false)
  assert.equal(readVisit(true, { token: 'V106' }).escalated, false)
})

test('the IST check-in stamp renders as date and time, unshifted', () => {
  // read out of the string, never through Date: the sheet stores IST
  // wall-clock with no offset, so a Date would move it into the viewer's zone
  assert.equal(formatCheckIn('2026-09-08 16:02:00'), '8 Sep 2026, 16:02')
  assert.equal(formatCheckIn('2026-01-01 09:05:00'), '1 Jan 2026, 09:05')
})

test('an unusable check-in stamp renders nothing rather than "Invalid Date"', () => {
  for (const bad of ['', undefined, null, 'garbage', '2026-13-08 16:02:00'])
    assert.equal(formatCheckIn(bad), '')
})

test('the raw timestamp is carried through the lookup', () => {
  assert.equal(readVisit(true, { token: 'V1', timestamp: '2026-09-08 16:02:00' }).timestamp, '2026-09-08 16:02:00')
  assert.equal(readVisit(true, { token: 'V1' }).timestamp, '')
})
