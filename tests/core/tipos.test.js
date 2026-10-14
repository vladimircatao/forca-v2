import assert from 'node:assert/strict'
import { test } from 'node:test'
import { JogadaInvalida } from '../../src/core/tipos.js'

test('JogadaInvalida guarda o código', () => {
  assert.equal(new JogadaInvalida('letra_repetida').codigo, 'letra_repetida')
})

test('JogadaInvalida usa o código como mensagem', () => {
  assert.equal(new JogadaInvalida('letra_repetida').message, 'letra_repetida')
})

test('JogadaInvalida é uma instância de Error e da própria classe', () => {
  const erro = new JogadaInvalida('letra_repetida')

  assert.ok(erro instanceof Error)
  assert.ok(erro instanceof JogadaInvalida)
})

test('JogadaInvalida define o nome da classe', () => {
  assert.equal(new JogadaInvalida('letra_repetida').name, 'JogadaInvalida')
})
