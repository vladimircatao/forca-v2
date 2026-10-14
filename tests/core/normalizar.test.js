import assert from 'node:assert/strict'
import { test } from 'node:test'

import { normalizarPalavra } from '../../src/core/normalizar.js'

test('tira o acento e passa para maiúsculas', () => {
  assert.equal(normalizarPalavra('Açúcar'), 'ACUCAR')
})

test('tira cedilha e til', () => {
  assert.equal(normalizarPalavra('coração'), 'CORACAO')
})

test('tira o til de letras já maiúsculas', () => {
  assert.equal(normalizarPalavra('ÃÕ'), 'AO')
})

test('palavra sem acento só vira maiúscula', () => {
  assert.equal(normalizarPalavra('casa'), 'CASA')
})

test('texto vazio continua vazio', () => {
  assert.equal(normalizarPalavra(''), '')
})

test('mantém espaço e símbolos', () => {
  assert.equal(normalizarPalavra('a b'), 'A B')
})
