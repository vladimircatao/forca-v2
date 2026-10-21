import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizarPalavra, normalizarLetra } from '../../src/core/normalizar.js'
import { JogadaInvalida } from '../../src/core/tipos.js'

test('normalizarPalavra remove acentos e converte para maiúsculas', () => {
  assert.equal(normalizarPalavra('Açúcar'), 'ACUCAR')
  assert.equal(normalizarPalavra('coração'), 'CORACAO')
  assert.equal(normalizarPalavra('ÃÕ'), 'AO')
  assert.equal(normalizarPalavra('casa'), 'CASA')
  assert.equal(normalizarPalavra(''), '')
  assert.equal(normalizarPalavra('a b'), 'A B')
})

test('normalizarLetra aceita letras simples e com acento', () => {
  assert.equal(normalizarLetra('a'), 'A')
  assert.equal(normalizarLetra('A'), 'A')
  assert.equal(normalizarLetra('é'), 'E')
  assert.equal(normalizarLetra('Ç'), 'C')
  assert.equal(normalizarLetra('ã'), 'A')
  // 'e' com acento combinante (U+0301)
  assert.equal(normalizarLetra('e\u0301'), 'E')
})

test('normalizarLetra rejeita entradas inválidas com JogadaInvalida(entrada_invalida)', () => {
  const invalidos = ['', ' ', 'ab', '1', '!', 'ß', 'a ']
  for (const entrada of invalidos) {
    assert.throws(
      () => normalizarLetra(entrada),
      (err) => err instanceof JogadaInvalida && err.codigo === 'entrada_invalida',
      `esperava JogadaInvalida('entrada_invalida') para "${entrada}"`,
    )
  }
})
