import assert from 'node:assert/strict'
import { test } from 'node:test'

import { ETAPAS, etapaDoDesenho } from '../../src/core/desenho.js'

test('com maxErros 6, erros 0 a 6 geram etapas 0 a 6', () => {
  assert.equal(etapaDoDesenho(0, 6), 0)
  assert.equal(etapaDoDesenho(1, 6), 1)
  assert.equal(etapaDoDesenho(2, 6), 2)
  assert.equal(etapaDoDesenho(3, 6), 3)
  assert.equal(etapaDoDesenho(4, 6), 4)
  assert.equal(etapaDoDesenho(5, 6), 5)
  assert.equal(etapaDoDesenho(6, 6), 6)
})

test('com maxErros 3, erros 0 a 3 geram etapas 0, 2, 4 e 6', () => {
  assert.equal(etapaDoDesenho(0, 3), 0)
  assert.equal(etapaDoDesenho(1, 3), 2)
  assert.equal(etapaDoDesenho(2, 3), 4)
  assert.equal(etapaDoDesenho(3, 3), 6)
})

test('limita a etapa ao total de partes do boneco', () => {
  assert.equal(etapaDoDesenho(9, 6), ETAPAS)
})

test('quem errou aparece com pelo menos uma parte', () => {
  assert.equal(etapaDoDesenho(1, 10), 1)
})

test('quebra a etapa em 3 quando há 5 erros em 10', () => {
  assert.equal(etapaDoDesenho(5, 10), 3)
})

test('numErros fora do domínio lança RangeError', () => {
  for (const erros of [-1, 1.5, Number.NaN, Infinity]) {
    assert.throws(() => etapaDoDesenho(erros, 6), RangeError)
  }
})

test('maxErros fora do domínio lança RangeError', () => {
  for (const max of [0, -1, 1.5, Number.NaN, Infinity]) {
    assert.throws(() => etapaDoDesenho(0, max), RangeError)
  }
})

test('erros negativos e maxErros inválido declaram RangeError', () => {
  assert.throws(() => etapaDoDesenho(-1, 6), RangeError)
  assert.throws(() => etapaDoDesenho(0, 0), RangeError)
})
