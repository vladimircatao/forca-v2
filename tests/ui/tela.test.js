import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

import { LETRAS, montarTeclado, renderizar } from '../../src/ui/tela.js'

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

test('renderizar mostra máscara, dica e erros para a visão da partida', () => {
  const { document } = new JSDOM(
    '<p id="mascara"></p><p id="categoria"></p><p id="erros"></p>',
  ).window

  renderizar(document, {
    mascara: '_A_A',
    categoria: 'Lugar',
    erros: 1,
    maxErros: 6,
  })

  const mascara = document.getElementById('mascara')
  const categoria = document.getElementById('categoria')
  const erros = document.getElementById('erros')

  assert.equal(mascara.textContent, '_ A _ A')
  assert.equal(mascara.getAttribute('aria-label'), 'Palavra: lacuna, A, lacuna, A')
  assert.equal(categoria.textContent, 'Dica: Lugar')
  assert.equal(erros.textContent, 'Erros: 1 de 6')
})

test('renderizar deixa a categoria vazia quando a dica está vazia', () => {
  const { document } = new JSDOM(
    '<p id="mascara"></p><p id="categoria"></p><p id="erros"></p>',
  ).window

  renderizar(document, {
    mascara: '_A_A',
    categoria: '',
    erros: 1,
    maxErros: 6,
  })

  assert.equal(document.getElementById('categoria').textContent, '')
})

test('renderizar duas vezes com a mesma visão deixa a página idempotente', () => {
  const { document } = new JSDOM(
    '<p id="mascara"></p><p id="categoria"></p><p id="erros"></p>',
  ).window

  const visao = {
    mascara: '_A_A',
    categoria: 'Lugar',
    erros: 1,
    maxErros: 6,
  }

  renderizar(document, visao)
  const antes = {
    mascara: document.getElementById('mascara').textContent,
    categoria: document.getElementById('categoria').textContent,
    erros: document.getElementById('erros').textContent,
    aria: document.getElementById('mascara').getAttribute('aria-label'),
  }

  renderizar(document, visao)

  assert.deepEqual(
    {
      mascara: document.getElementById('mascara').textContent,
      categoria: document.getElementById('categoria').textContent,
      erros: document.getElementById('erros').textContent,
      aria: document.getElementById('mascara').getAttribute('aria-label'),
    },
    antes,
  )
})
