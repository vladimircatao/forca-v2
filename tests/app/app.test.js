import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

import { CHAVE, iniciarApp } from '../../src/app/app.js'

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')

function prepararAplicacao(rng = () => 0) {
  const { document } = new JSDOM(html).window
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

  iniciarApp({ doc: document, ctx, rng })

  return { document, chamadas }
}

test('exporta a chave definida para o jogo', () => {
  assert.equal(CHAVE, 'forca:jogo')
})

test('iniciarApp mostra a máscara, a dica e os erros iniciais', () => {
  const { document } = prepararAplicacao()

  assert.equal(document.getElementById('mascara').textContent, '_ _ _ _ _ _ _')
  assert.equal(document.getElementById('categoria').textContent, 'Dica: Fruta')
  assert.equal(document.getElementById('erros').textContent, 'Erros: 0 de 6')
})

test('iniciarApp mantém o botão de novo jogo escondido', () => {
  const { document } = prepararAplicacao()

  assert.equal(document.getElementById('novo').hidden, true)
})

test('iniciarApp monta os 26 botões do teclado', () => {
  const { document } = prepararAplicacao()

  assert.equal(document.querySelectorAll('#teclado button').length, 26)
})

test('iniciarApp desenha a estrutura inicial com quatro chamadas de stroke', () => {
  const { chamadas } = prepararAplicacao()

  assert.equal(chamadas.filter(([nome]) => nome === 'stroke').length, 4)
})

test('iniciarApp não mostra a palavra secreta no texto da página', () => {
  const { document } = prepararAplicacao()

  assert.equal(document.body.textContent.includes('ABACAXI'), false)
})
