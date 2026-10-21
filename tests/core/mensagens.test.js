import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mensagemDeErro } from '../../src/core/mensagens.js'

test('mensagemDeErro traduz letra_repetida', () => {
  assert.equal(mensagemDeErro('letra_repetida'), 'Você já tentou essa letra.')
})

test('mensagemDeErro traduz entrada_invalida', () => {
  assert.equal(mensagemDeErro('entrada_invalida'), 'Digite uma única letra de A a Z.')
})

test('mensagemDeErro traduz jogo_encerrado', () => {
  assert.equal(mensagemDeErro('jogo_encerrado'), 'O jogo já terminou.')
})

test('mensagemDeErro rejeita códigos desconhecidos', () => {
  assert.throws(() => mensagemDeErro('outra'), RangeError)
  assert.throws(() => mensagemDeErro('toString'), RangeError)
})

test('mensagemDeErro não traduz salvamento_invalido', () => {
  assert.throws(() => mensagemDeErro('salvamento_invalido'), RangeError)
})
