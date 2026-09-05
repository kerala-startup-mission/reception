import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildPayload, readResponse } from './payload.js'

test('sends all five fields, trimmed', () => {
  const body = buildPayload({
    name: '  sidharth ',
    email: 'sidharth@startupmission.in',
    phone: ' +919495513259',
    organisation: 'KSUM ',
    requirement: 'Financial Assistance',
  })
  assert.deepEqual([...body.keys()].sort(), [
    'email',
    'name',
    'organisation',
    'phone',
    'requirement',
  ])
  assert.equal(body.get('name'), 'sidharth')
  assert.equal(body.get('phone'), '+919495513259')
  assert.equal(body.get('organisation'), 'KSUM')
})

test('requirement stays English even when the UI is Malayalam', () => {
  // the Malayalam label is സാമ്പത്തിക സഹായം but the value sent is the English string
  const body = buildPayload({
    name: 'a',
    email: 'a@b.in',
    phone: '+911',
    organisation: 'c',
    requirement: 'Financial Assistance',
  })
  assert.equal(body.get('requirement'), 'Financial Assistance')
  assert.equal(body.toString().includes('requirement=Financial+Assistance'), true)
})

test('success carries the token the API issued', () => {
  const r = readResponse(true, { message: 'Success', id: 'abc', token: 'V105' })
  assert.deepEqual(r, { ok: true, token: 'V105' })
})

test('failure carries the API reason verbatim', () => {
  const r = readResponse(false, {
    message: 'Error',
    error: 'Invalid phone number format: Invalid country calling code',
  })
  assert.equal(r.ok, false)
  assert.equal(r.error, 'Invalid phone number format: Invalid country calling code')
})

test('non-JSON body leaves the caller to supply its own wording', () => {
  assert.deepEqual(readResponse(false, null), { ok: false, error: '' })
  assert.deepEqual(readResponse(true, null), { ok: true, token: '' })
})
