import assert from 'node:assert/strict'
import { test } from 'node:test'

import { desenharForca } from '../../src/ui/canvas.js'

function criarContextoFalso() {
  const chamadas = []

  const ctx = new Proxy(
    {},
    {
      get(_alvo, propriedade) {
        return (...argumentos) => chamadas.push([propriedade, ...argumentos])
      },
      set(_alvo, propriedade, valor) {
        chamadas.push([propriedade, valor])
        return true
      },
    },
  )

  return { ctx, chamadas }
}

test('com 0 erros desenha as quatro partes da estrutura', () => {
  const { ctx, chamadas } = criarContextoFalso()

  desenharForca(ctx, 0, 6)

  assert.equal(chamadas.filter(([nome]) => nome === 'stroke').length, 4)
  assert.equal(chamadas.filter(([nome]) => nome === 'arc').length, 0)
})

test('com 1 erro desenha a cabeça e com 6 erros desenha o boneco completo', () => {
  const contextoComUmErro = criarContextoFalso()
  const contextoComSeisErros = criarContextoFalso()

  desenharForca(contextoComUmErro.ctx, 1, 6)
  desenharForca(contextoComSeisErros.ctx, 6, 6)

  assert.equal(contextoComUmErro.chamadas.filter(([nome]) => nome === 'stroke').length, 5)
  assert.equal(contextoComUmErro.chamadas.filter(([nome]) => nome === 'arc').length, 1)
  assert.equal(contextoComSeisErros.chamadas.filter(([nome]) => nome === 'stroke').length, 10)
  assert.equal(contextoComSeisErros.chamadas.filter(([nome]) => nome === 'arc').length, 1)
})

test('limpa o canvas uma vez antes do primeiro stroke', () => {
  const { ctx, chamadas } = criarContextoFalso()

  desenharForca(ctx, 0, 6)

  const indiceClearRect = chamadas.findIndex(([nome]) => nome === 'clearRect')
  const indiceStroke = chamadas.findIndex(([nome]) => nome === 'stroke')

  assert.equal(chamadas.filter(([nome]) => nome === 'clearRect').length, 1)
  assert.equal(chamadas[indiceClearRect], ['clearRect', 0, 0, 200, 250])
  assert.ok(indiceClearRect < indiceStroke)
})

test('configura traço de 4 px, pontas arredondadas e cor escura', () => {
  const { ctx, chamadas } = criarContextoFalso()

  desenharForca(ctx, 0, 6)

  assert.deepEqual(chamadas.slice(1, 4), [
    ['lineWidth', 4],
    ['lineCap', 'round'],
    ['strokeStyle', '#222'],
  ])
})
