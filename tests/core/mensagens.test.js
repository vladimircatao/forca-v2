import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mensagemDeErro, mensagemFinal } from '../../src/core/mensagens.js'

test('mensagemDeErro traduz letra repetida', () => {
  assert.equal(mensagemDeErro('letra_repetida'), 'Você já tentou essa letra.')
})

test('mensagemDeErro traduz entrada inválida', () => {
  assert.equal(mensagemDeErro('entrada_invalida'), 'Digite uma única letra de A a Z.')
})

test('mensagemDeErro traduz jogo encerrado', () => {
  assert.equal(mensagemDeErro('jogo_encerrado'), 'O jogo já terminou.')
})

test('mensagemDeErro lança RangeError para códigos desconhecidos', () => {
  assert.throws(() => mensagemDeErro('outra'), RangeError)
  assert.throws(() => mensagemDeErro('toString'), RangeError)
})

test('mensagemFinal retorna null quando o jogo ainda está em andamento', () => {
  const visao = { status: 'em_andamento', palavra: null }

  assert.equal(mensagemFinal(visao), null)
})

test('mensagemFinal devolve a mensagem de vitória', () => {
  const visao = { status: 'venceu', palavra: 'CASA' }

  assert.equal(mensagemFinal(visao), 'Parabéns! Você descobriu a palavra: CASA')
})

test('mensagemFinal devolve a mensagem de derrota', () => {
  const visao = { status: 'perdeu', palavra: 'CASA' }

  assert.equal(mensagemFinal(visao), 'Fim de jogo. A palavra era: CASA')
})
