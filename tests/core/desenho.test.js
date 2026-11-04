import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ALTURA, LARGURA, planoDeDesenho } from '../../src/core/desenho.js'

test('largura e altura lógicas do desenho seguem a especificação', () => {
  assert.equal(LARGURA, 200)
  assert.equal(ALTURA, 250)
})

test('para erros de 0 a 6 o plano tem 4 + etapa formas com maxErros 6', () => {
  for (let erros = 0; erros <= 6; erros += 1) {
    const plano = planoDeDesenho(erros, 6)
    assert.equal(plano.length, 4 + erros)
  }
})

test('com 1 erro a última forma é cabeca como círculo em (130,70) com raio 20', () => {
  const plano = planoDeDesenho(1, 6)

  assert.deepEqual(plano.at(-1), {
    tipo: 'circulo',
    nome: 'cabeca',
    x: 130,
    y: 70,
    r: 20,
  })
})

test('com 6 erros a última forma é perna_direita', () => {
  const plano = planoDeDesenho(6, 6)

  assert.equal(plano.at(-1)?.nome, 'perna_direita')
})

test('cada erro apenas acrescenta formas: plano de n erros é prefixo do plano de n+1', () => {
  for (let erros = 0; erros < 6; erros += 1) {
    const planoAtual = planoDeDesenho(erros, 6)
    const proximoPlano = planoDeDesenho(erros + 1, 6)

    assert.deepEqual(proximoPlano.slice(0, planoAtual.length), planoAtual)
  }
})

test('com 0 erros o plano é exatamente base, poste, trave, corda', () => {
  const plano = planoDeDesenho(0, 6)

  assert.deepEqual(
    plano.map((forma) => forma.nome),
    ['base', 'poste', 'trave', 'corda'],
  )
})

test('plano e formas ficam congelados', () => {
  const plano = planoDeDesenho(1, 6)

  assert.equal(Object.isFrozen(plano), true)
  for (const forma of plano) {
    assert.equal(Object.isFrozen(forma), true)
  }
})

test('com maxErros 3 e 2 erros o plano inclui 4 partes do boneco', () => {
  const plano = planoDeDesenho(2, 3)

  assert.equal(plano.length, 8)
  assert.equal(plano.at(-1)?.nome, 'braco_direito')
})
