import assert from 'node:assert/strict'
import { test } from 'node:test'
import { criarRng } from '../../src/core/rng.js'

test('dois geradores com semente 42 produzem exatamente a mesma sequência de 100 números', () => {
  const rngA = criarRng(42)
  const rngB = criarRng(42)

  for (let i = 0; i < 100; i += 1) {
    assert.equal(rngA(), rngB())
  }
})

test('todos os números gerados ficam no intervalo [0, 1)', () => {
  const rng = criarRng(42)

  for (let i = 0; i < 100; i += 1) {
    const valor = rng()
    assert.ok(valor >= 0)
    assert.ok(valor < 1)
  }
})

test('sementes 1 e 2 produzem primeiros valores diferentes', () => {
  const rng1 = criarRng(1)
  const rng2 = criarRng(2)

  assert.notEqual(rng1(), rng2())
})
