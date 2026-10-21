import assert from 'node:assert/strict'
import { test } from 'node:test'
import { jogar, novoJogo } from '../../src/core/jogo.js'
import { visao } from '../../src/core/visao.js'

test('visão inicial de CASA segue o formato esperado', () => {
  const estado = novoJogo('CASA')

  assert.deepEqual(visao(estado), {
    mascara: '____',
    categoria: '',
    tentativas: [],
    erros: 0,
    maxErros: 6,
    status: 'em_andamento',
    palavra: null,
  })
})

test("após jogar 'a' em CASA a máscara fica _A_A", () => {
  const estado = jogar(novoJogo('CASA'), 'a')

  assert.equal(visao(estado).mascara, '_A_A')
})

test("após jogar 'c' e 'z' em CASA tentativas são C,Z e erros é 1", () => {
  const aposC = jogar(novoJogo('CASA'), 'c')
  const aposCZ = jogar(aposC, 'z')

  assert.deepEqual(visao(aposCZ).tentativas, ['C', 'Z'])
  assert.equal(visao(aposCZ).erros, 1)
})

test("durante o jogo JSON da visão não contém 'CASA'", () => {
  const estado = jogar(novoJogo('CASA'), 'a')
  const textoJson = JSON.stringify(visao(estado))

  assert.equal(textoJson.includes('CASA'), false)
})

test('após perder em CASA a visão mostra status perdeu, palavra CASA e máscara ____', () => {
  const estado = {
    ...novoJogo('CASA', { maxErros: 1 }),
    tentativas: ['Z'],
  }

  assert.deepEqual(visao(estado), {
    mascara: '____',
    categoria: '',
    tentativas: ['Z'],
    erros: 1,
    maxErros: 1,
    status: 'perdeu',
    palavra: 'CASA',
  })
})

test('após vencer em CASA a visão mostra status venceu, palavra CASA e máscara CASA', () => {
  const estado = {
    ...novoJogo('CASA'),
    tentativas: ['C', 'A', 'S'],
  }

  assert.deepEqual(visao(estado), {
    mascara: 'CASA',
    categoria: '',
    tentativas: ['C', 'A', 'S'],
    erros: 0,
    maxErros: 6,
    status: 'venceu',
    palavra: 'CASA',
  })
})

test('visão devolve objeto congelado', () => {
  const estado = novoJogo('CASA')
  const dadosVisao = visao(estado)

  assert.equal(Object.isFrozen(dadosVisao), true)
})
