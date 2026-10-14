import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JogadaInvalida } from '../../src/core/tipos.js'

test('codigo preserva o código informado', () => {
  assert.equal(new JogadaInvalida('letra_repetida').codigo, 'letra_repetida')
})

test('message recebe o código informado', () => {
  assert.equal(new JogadaInvalida('letra_repetida').message, 'letra_repetida')
})

test('é uma instância de Error e de JogadaInvalida', () => {
  const erro = new JogadaInvalida('letra_repetida')

  assert.ok(erro instanceof Error)
  assert.ok(erro instanceof JogadaInvalida)
})

test('name identifica o erro', () => {
  assert.equal(new JogadaInvalida('letra_repetida').name, 'JogadaInvalida')
})
