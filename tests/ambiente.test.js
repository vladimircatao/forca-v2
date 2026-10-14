import assert from 'node:assert/strict'
import { test } from 'node:test'

// Teste provisório: garante que o CI e o `npm test` funcionam antes da primeira issue.
// A issue #2 apaga este arquivo.
test('o ambiente de testes funciona', () => {
  assert.equal(1 + 1, 2)
})
