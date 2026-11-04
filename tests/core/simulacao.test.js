import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  criarRng,
  erros,
  escolher,
  jogar,
  JogadaInvalida,
  normalizarPalavra,
  novoJogo,
  PALAVRAS,
  status,
  visao,
} from '../../src/core/index.js'

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function simularPartidaSoComErros(palavra, categoria = '') {
  let estado = novoJogo(palavra, { categoria })
  const jogadas = []

  for (const letra of ALFABETO) {
    if (normalizarPalavra(palavra).includes(letra)) {
      continue
    }

    estado = jogar(estado, letra)
    jogadas.push(letra)

    if (status(estado) !== 'em_andamento') {
      break
    }
  }

  return { estado, jogadas }
}

test('robô que conhece a palavra vence sem erros nas 30 palavras', () => {
  assert.equal(PALAVRAS.length, 30)

  for (const { palavra, categoria } of PALAVRAS) {
    let estado = novoJogo(palavra, { categoria })
    const letras = new Set(normalizarPalavra(palavra))

    for (const letra of letras) {
      estado = jogar(estado, letra)
    }

    const visaoFinal = visao(estado)

    assert.equal(status(estado), 'venceu')
    assert.equal(erros(estado), 0)
    assert.equal(visaoFinal.palavra, palavra)
    assert.equal(visaoFinal.mascara.includes('_'), false)
  }
})

test('robô que só erra perde após seis jogadas nas 30 palavras', () => {
  for (const { palavra, categoria } of PALAVRAS) {
    let estado = novoJogo(palavra, { categoria })
    const sequenciaDeErros = []
    const statusDasJogadas = []

    for (const letra of ALFABETO) {
      if (normalizarPalavra(palavra).includes(letra)) {
        continue
      }

      estado = jogar(estado, letra)
      sequenciaDeErros.push(erros(estado))
      const statusAtual = status(estado)
      statusDasJogadas.push(statusAtual)

      if (statusAtual === 'em_andamento') {
        const visaoAtual = visao(estado)
        const jsonDaVisao = JSON.stringify(visaoAtual)

        assert.equal(visaoAtual.palavra, null)
        assert.equal(jsonDaVisao.includes(palavra), false)
      } else {
        break
      }
    }

    assert.equal(estado.tentativas.length, 6)
    assert.deepEqual(sequenciaDeErros, [1, 2, 3, 4, 5, 6])
    assert.deepEqual(statusDasJogadas.slice(0, 5), [
      'em_andamento',
      'em_andamento',
      'em_andamento',
      'em_andamento',
      'em_andamento',
    ])
    assert.equal(statusDasJogadas.at(-1), 'perdeu')
  }
})

test('a mesma semente e as mesmas jogadas produzem o mesmo estado final', () => {
  function simularComSemente(semente) {
    const palavraSorteada = escolher(criarRng(semente), PALAVRAS)
    return simularPartidaSoComErros(palavraSorteada.palavra, palavraSorteada.categoria)
  }

  const primeiraExecucao = simularComSemente(2026)
  const segundaExecucao = simularComSemente(2026)

  assert.deepEqual(primeiraExecucao.jogadas, segundaExecucao.jogadas)
  assert.deepEqual(primeiraExecucao.estado, segundaExecucao.estado)
})

test('repetir uma letra é recusado sem aumentar os erros', () => {
  const estadoComErro = jogar(novoJogo('CASA'), 'Z')

  assert.throws(
    () => jogar(estadoComErro, 'Z'),
    (erro) => erro instanceof JogadaInvalida && erro.codigo === 'letra_repetida',
  )
  assert.equal(erros(estadoComErro), 1)
  assert.deepEqual(estadoComErro.tentativas, ['Z'])
})
