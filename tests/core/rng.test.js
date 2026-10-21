import assert from 'node:assert/strict'
import { test } from 'node:test'
import { criarRng } from '../../src/core/rng.js'

test('dois geradores com a mesma semente 42 geram a mesma sequência de 100 números', () => {
  const rngA = criarRng(42)
  const rngB = criarRng(42)

  for (let i = 0; i < 100; i += 1) {
    assert.equal(rngA(), rngB())
  }
})

test('números gerados ficam no intervalo [0, 1)', () => {
  const rng = criarRng(42)

  for (let i = 0; i < 1000; i += 1) {
    const numero = rng()
    assert.equal(numero >= 0, true)
    assert.equal(numero < 1, true)
  }
})

test('sementes 1 e 2 geram primeiros valores diferentes', () => {
  const rngA = criarRng(1)
  const rngB = criarRng(2)

  assert.notEqual(rngA(), rngB())
})
