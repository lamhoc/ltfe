const test = require('node:test');
const assert = require('node:assert/strict');

const { hashPassword, verifyPassword, validateEmail, validatePassword } = require('../lib/auth');

test('hash and verify password works', () => {
  const password = 'Abc123!';
  const hash = hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword('wrong-password', hash), false);
});

test('email validation accepts valid emails', () => {
  assert.equal(validateEmail('demo@gmail.com'), true);
  assert.equal(validateEmail('bad-email'), false);
});

test('password validation enforces length and complexity', () => {
  assert.equal(validatePassword('Abc12345!'), true);
  assert.equal(validatePassword('abc123'), false);
  assert.equal(validatePassword('short'), false);
});
