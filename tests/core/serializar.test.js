import assert from 'node:assert/strict'
import { test } from 'node:test'
import { novoJogo } from '../../src/core/jogo.js'
import { serializar } from '../../src/core/serializar.js'

test('serializar produz JSON com versao, palavra, categoria, maxErros e tentativas', () => {
  const estado = {
    ...novoJogo('CASA', { categoria: 'Lugar' }),
    tentativas: ['c', 'z'],
  }

  const texto = serializar(estado)
  const dados = JSON.parse(texto)

  assert.deepEqual(dados, {
    versao: 1,
    palavra: 'CASA',
    categoria: 'Lugar',
    maxErros: 6,
    tentativas: ['C', 'Z'],
  })

  assert.equal(texto.includes('erros'), false)
  assert.equal(texto.includes('status'), false)
  assert.equal(
    texto,
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":6,"tentativas":["C","Z"]}',
  )
})

test('serializar converte tentativas para maiúsculas sem expor campos derivados', () => {
  const estado = {
    ...novoJogo('AÇÚCAR', { categoria: 'Comida' }),
    tentativas: ['a', 'u', 'z'],
  }

  const dados = JSON.parse(serializar(estado))

  assert.deepEqual(dados.tentativas, ['A', 'U', 'Z'])
  assert.equal('status' in dados, false)
  assert.equal('erros' in dados, false)
})
