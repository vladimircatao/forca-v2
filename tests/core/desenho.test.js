import assert from 'node:assert/strict'
import { test } from 'node:test'
import { etapaDoDesenho, ETAPAS } from '../../src/core/desenho.js'

test('etapaDoDesenho com maxErros 6 devolve uma etapa para cada erro', () => {
  const esperados = [0, 1, 2, 3, 4, 5, 6]

  for (const [erros, esperado] of esperados.map((valor) => [valor, valor])) {
    assert.equal(etapaDoDesenho(erros, 6), esperado)
  }
})

test('etapaDoDesenho com maxErros 3 escala em intervalos de duas etapas', () => {
  const esperados = [0, 2, 4, 6]

  for (const [erros, esperado] of [
    [0, 0],
    [1, 2],
    [2, 4],
    [3, 6],
  ]) {
    assert.equal(etapaDoDesenho(erros, 3), esperado)
  }

  assert.deepEqual(
    [0, 1, 2, 3].map((erros) => etapaDoDesenho(erros, 3)),
    esperados,
  )
})

test('etapaDoDesenho limita a etapa pelo total de partes do boneco', () => {
  assert.equal(etapaDoDesenho(9, 6), ETAPAS)
})

test('etapaDoDesenho garante que um erro inicial aparece com pelo menos uma parte', () => {
  assert.equal(etapaDoDesenho(1, 10), 1)
})

test('etapaDoDesenho calcula etapa intermediária para cinco erros em dez', () => {
  assert.equal(etapaDoDesenho(5, 10), 3)
})

test('etapaDoDesenho lança RangeError para erros negativos', () => {
  assert.throws(() => etapaDoDesenho(-1, 6), RangeError)
})

test('etapaDoDesenho lança RangeError para maxErros inválido', () => {
  assert.throws(() => etapaDoDesenho(0, 0), RangeError)
})
