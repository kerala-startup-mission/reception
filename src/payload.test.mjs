import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPayload, readResponse, readVisit } from './payload.js'

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
