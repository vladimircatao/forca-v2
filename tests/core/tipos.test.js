import assert from 'node:assert/strict'
import { test } from 'node:test'

import { JogadaInvalida } from '../../src/core/tipos.js'

test('guarda o código recebido', () => {
  assert.equal(new JogadaInvalida('letra_repetida').codigo, 'letra_repetida')
})

test('usa o código como mensagem', () => {
  assert.equal(new JogadaInvalida('letra_repetida').message, 'letra_repetida')
})

test('é um Error e um JogadaInvalida', () => {
  const erro = new JogadaInvalida('letra_repetida')
  assert.ok(erro instanceof Error)
  assert.ok(erro instanceof JogadaInvalida)
})

test('tem o nome JogadaInvalida', () => {
  assert.equal(new JogadaInvalida('letra_repetida').name, 'JogadaInvalida')
})
