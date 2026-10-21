import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { JSDOM } from 'jsdom'

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const { document } = new JSDOM(html).window

test('html usa português do Brasil e título da página', () => {
  assert.equal(document.documentElement.lang, 'pt-BR')
  assert.equal(document.title, 'Jogo da Forca')
  assert.equal(document.querySelectorAll('h1').length, 1)
})

test('a página expõe os elementos esperados do contrato da interface', () => {
  const ids = [
    'categoria',
    'mascara',
    'erros',
    'aviso',
    'teclado',
    'novo',
    'desenho',
  ]

  for (const id of ids) {
    assert.ok(document.getElementById(id), `faltando elemento com id=${id}`)
  }

  const desenho = document.getElementById('desenho')
  assert.equal(desenho.getAttribute('width'), '200')
  assert.equal(desenho.getAttribute('height'), '250')

  const novo = document.getElementById('novo')
  assert.equal(novo.hasAttribute('hidden'), true)
  assert.equal(novo.getAttribute('type'), 'button')

  const aviso = document.getElementById('aviso')
  assert.equal(aviso.getAttribute('role'), 'status')
})

test('há meta viewport e script do módulo principal', () => {
  assert.ok(document.querySelector('meta[name="viewport"]'))

  const script = document.querySelector('script[type="module"]')
  assert.ok(script)
  assert.equal(script.getAttribute('src'), 'src/app/main.js')
})
