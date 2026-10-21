import assert from 'node:assert/strict'
import { test } from 'node:test'
import { erros, novoJogo } from '../../src/core/jogo.js'

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

test('erros sem tentativas devolve zero', () => {
  const estado = { ...novoJogo('CASA'), tentativas: [] }

  assert.equal(erros(estado), 0)
})

test('erros conta apenas letras que não pertencem à palavra', () => {
  const estadoComErro = { ...novoJogo('CASA'), tentativas: ['C', 'Z'] }
  const estadoSemErro = { ...novoJogo('CASA'), tentativas: ['C', 'A', 'S'] }
  const estadoComTresErros = { ...novoJogo('CASA'), tentativas: ['Z', 'X', 'W'] }

  assert.equal(erros(estadoComErro), 1)
  assert.equal(erros(estadoSemErro), 0)
  assert.equal(erros(estadoComTresErros), 3)
})

test('erros ignora acento ao comparar letras', () => {
  const estado = { ...novoJogo('AÇÚCAR'), tentativas: ['U', 'C'] }

  assert.equal(erros(estado), 0)
})
