import assert from 'node:assert/strict'
import { test } from 'node:test'
import { erros, jogar, novoJogo, status } from '../../src/core/jogo.js'
import { JogadaInvalida } from '../../src/core/tipos.js'

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

test('jogar aplica a letra normalizada na lista de tentativas', () => {
  const estado = jogar(novoJogo('CASA'), 'c')

  assert.deepEqual(estado.tentativas, ['C'])
})

test('jogar não altera o estado original recebido', () => {
  const estadoOriginal = novoJogo('CASA')

  jogar(estadoOriginal, 'c')

  assert.deepEqual(estadoOriginal.tentativas, [])
})

test('jogar devolve novo estado e novo array de tentativas congelados', () => {
  const estado = jogar(novoJogo('CASA'), 'c')

  assert.equal(Object.isFrozen(estado), true)
  assert.equal(Object.isFrozen(estado.tentativas), true)
})

test("jogar em AÇÚCAR com 'u' não conta erro e guarda U", () => {
  const estado = jogar(novoJogo('AÇÚCAR'), 'u')

  assert.equal(erros(estado), 0)
  assert.deepEqual(estado.tentativas, ['U'])
})

test('jogar letra errada em CASA conta 1 erro', () => {
  const estado = jogar(novoJogo('CASA'), 'z')

  assert.equal(erros(estado), 1)
})

test('jogar entrada inválida lança JogadaInvalida com codigo entrada_invalida', () => {
  for (const entrada of ['1', 'ab', '']) {
    assert.throws(
      () => jogar(novoJogo('CASA'), entrada),
      (erro) => erro instanceof JogadaInvalida && erro.codigo === 'entrada_invalida',
    )
  }
})

test('status mantém o jogo em andamento antes de vencer ou perder', () => {
  const emAndamento = { ...novoJogo('CASA'), tentativas: [] }
  const quaseVitoria = { ...novoJogo('CASA'), tentativas: ['C', 'A'] }
  const vitoria = { ...novoJogo('CASA'), tentativas: ['C', 'A', 'S'] }
  const quaseDerrota = { ...novoJogo('CASA'), tentativas: ['Z', 'X', 'W', 'K', 'Y'] }
  const derrota = { ...novoJogo('CASA'), tentativas: ['Z', 'X', 'W', 'K', 'Y', 'Q'] }
  const derrotaComLimite = { ...novoJogo('CASA', { maxErros: 2 }), tentativas: ['Z', 'X'] }

  assert.equal(status(emAndamento), 'em_andamento')
  assert.equal(status(quaseVitoria), 'em_andamento')
  assert.equal(status(vitoria), 'venceu')
  assert.equal(status(quaseDerrota), 'em_andamento')
  assert.equal(status(derrota), 'perdeu')
  assert.equal(status(derrotaComLimite), 'perdeu')
})

test('status vence palavras com acento ao comparar letras normalizadas', () => {
  const estado = { ...novoJogo('AÇÚCAR'), tentativas: ['A', 'C', 'U', 'R'] }

  assert.equal(status(estado), 'venceu')
})
