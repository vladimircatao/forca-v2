import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as nucleo from '../../src/core/index.js'

const { PALAVRAS, criarRng, escolher, jogar, novoJogo, visao, normalizarPalavra, status, erros } = nucleo

function letrasDePalavra(palavra) {
  return [...new Set(normalizarPalavra(palavra).split(''))]
}

function roboQueConhecePalavra(palavra) {
  let estado = novoJogo(palavra)

  for (const letra of letrasDePalavra(palavra)) {
    estado = jogar(estado, letra)
  }

  return estado
}

function roboQueSoleErra(palavra) {
  const letrasInvalidas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    .split('')
    .filter((letra) => !normalizarPalavra(palavra).includes(letra))

  let estado = novoJogo(palavra)
  const errosNaPartida = []
  const statusPorJogada = []

  for (const letra of letrasInvalidas) {
    if (status(estado) !== 'em_andamento') {
      break
    }

    estado = jogar(estado, letra)
    errosNaPartida.push(erros(estado))
    statusPorJogada.push(status(estado))
  }

  return { estado, errosNaPartida, statusPorJogada }
}

test('robô que conhece a palavra vence todas as 30 palavras sem erros', () => {
  for (const item of PALAVRAS) {
    const estado = roboQueConhecePalavra(item.palavra)
    const dadosVisao = visao(estado)

    assert.equal(dadosVisao.erros, 0)
    assert.equal(dadosVisao.status, 'venceu')
    assert.equal(dadosVisao.palavra, item.palavra)
    assert.equal(dadosVisao.mascara, item.palavra)
    assert.equal(dadosVisao.mascara.includes('_'), false)
  }
})

test('robô que só erra perde após seis jogadas e a sequência de erros e status é esperada', () => {
  for (const item of PALAVRAS) {
    const { estado, errosNaPartida, statusPorJogada } = roboQueSoleErra(item.palavra)

    assert.deepEqual(errosNaPartida, [1, 2, 3, 4, 5, 6])
    assert.deepEqual(statusPorJogada.slice(0, 5), Array(5).fill('em_andamento'))
    assert.equal(statusPorJogada.at(-1), 'perdeu')
    assert.equal(estado.palavra, item.palavra)
    assert.equal(status(estado), 'perdeu')
  }
})

test('durante o jogo a visão não revela a palavra e o JSON não contém a palavra', () => {
  for (const item of PALAVRAS) {
    const letrasInvalidas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      .split('')
      .filter((letra) => !normalizarPalavra(item.palavra).includes(letra))

    let estado = novoJogo(item.palavra)
    for (const letra of letrasInvalidas) {
      if (status(estado) !== 'em_andamento') {
        break
      }

      estado = jogar(estado, letra)
      const dadosVisao = visao(estado)

      if (status(estado) === 'em_andamento') {
        assert.equal(dadosVisao.palavra, null)
        assert.equal(JSON.stringify(dadosVisao).includes(item.palavra), false)
      }
    }
  }
})

test('a mesma semente e as mesmas jogadas produzem o mesmo estado final em duas execuções', () => {
  const rng1 = criarRng(2026)
  const rng2 = criarRng(2026)
  const palavra1 = escolher(rng1, PALAVRAS).palavra
  const palavra2 = escolher(rng2, PALAVRAS).palavra

  assert.equal(palavra1, palavra2)

  const jogadas = letrasDePalavra(palavra1)
  let estado1 = novoJogo(palavra1)
  let estado2 = novoJogo(palavra2)

  for (const letra of jogadas) {
    estado1 = jogar(estado1, letra)
    estado2 = jogar(estado2, letra)
  }

  assert.deepEqual(estado1, estado2)
})

test('repetir uma letra já jogada não aumenta os erros', () => {
  const estado = jogar(novoJogo('CASA'), 'z')

  assert.throws(
    () => jogar(estado, 'Z'),
    (erro) => erro instanceof Error && erro.message === 'letra_repetida',
  )
  assert.equal(erros(estado), 1)
})
