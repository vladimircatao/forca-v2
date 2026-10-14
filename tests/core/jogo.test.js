import assert from 'node:assert/strict'
import { test } from 'node:test'
import { novoJogo } from '../../src/core/jogo.js'

test('novoJogo cria partida com palavra, categoria, maxErros padrão e tentativas vazias', () => {
  const estado = novoJogo('casa', { categoria: 'Lugar' })

  assert.equal(estado.palavra, 'CASA')
  assert.equal(estado.categoria, 'Lugar')
  assert.equal(estado.maxErros, 6)
  assert.deepEqual(estado.tentativas, [])
})

test('novoJogo mantém acentos na palavra em maiúsculas', () => {
  const estado = novoJogo('AÇÚCAR')

  assert.equal(estado.palavra, 'AÇÚCAR')
})

test('novoJogo devolve objeto e tentativas congelados', () => {
  const estado = novoJogo('casa')

  assert.equal(Object.isFrozen(estado), true)
  assert.equal(Object.isFrozen(estado.tentativas), true)
})

test('novoJogo lança RangeError para palavra vazia', () => {
  assert.throws(() => novoJogo(''), RangeError)
})

test('novoJogo lança RangeError para palavra com espaço', () => {
  assert.throws(() => novoJogo('ca sa'), RangeError)
})

test('novoJogo lança RangeError para palavra com dígito', () => {
  assert.throws(() => novoJogo('c4sa'), RangeError)
})

test('novoJogo lança RangeError para maxErros menor que 1', () => {
  assert.throws(() => novoJogo('casa', { maxErros: 0 }), RangeError)
})

test('novoJogo lança RangeError para maxErros não inteiro', () => {
  assert.throws(() => novoJogo('casa', { maxErros: 2.5 }), RangeError)
})
