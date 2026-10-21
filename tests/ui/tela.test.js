import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

import { LETRAS, montarTeclado } from '../../src/ui/tela.js'

test('exporta a sequência de letras da interface', () => {
  assert.equal(LETRAS, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
})

test('há 26 botões em #teclado, na ordem A–Z, todos type button', () => {
  const { document } = new JSDOM('<div id="teclado"></div>').window

  montarTeclado(document, () => {})

  const botoes = [...document.querySelectorAll('#teclado button')]

  assert.equal(botoes.length, 26)
  assert.deepEqual(botoes.map((botao) => botao.textContent), [...LETRAS])
  assert.deepEqual(botoes.map((botao) => botao.dataset.letra), [...LETRAS])
  assert.equal(botoes.every((botao) => botao.getAttribute('type') === 'button'), true)
})

test('clicar no botão K chama aoEscolher uma vez com "K"', () => {
  const { document } = new JSDOM('<div id="teclado"></div>').window
  const chamadas = []

  montarTeclado(document, (letra) => {
    chamadas.push(letra)
  })

  const botaoK = [...document.querySelectorAll('#teclado button')].find(
    (botao) => botao.dataset.letra === 'K',
  )

  assert.ok(botaoK)
  botaoK.click()
  assert.deepEqual(chamadas, ['K'])
})

test('chamar montarTeclado duas vezes continua deixando 26 botões', () => {
  const { document } = new JSDOM('<div id="teclado"></div>').window

  montarTeclado(document, () => {})
  montarTeclado(document, () => {})

  assert.equal(document.querySelectorAll('#teclado button').length, 26)
})
