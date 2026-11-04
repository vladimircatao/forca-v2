import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as nucleo from '../../src/core/index.js'

test('o núcleo exporta exatamente os 22 nomes da API pública', () => {
  assert.deepEqual(Object.keys(nucleo).sort(), [
    'ALTURA',
    'ETAPAS',
    'JogadaInvalida',
    'LARGURA',
    'PALAVRAS',
    'criarRng',
    'desserializar',
    'erros',
    'escolher',
    'etapaDoDesenho',
    'jogar',
    'mascara',
    'mensagemDaJogada',
    'mensagemDeErro',
    'mensagemFinal',
    'normalizarLetra',
    'normalizarPalavra',
    'novoJogo',
    'planoDeDesenho',
    'serializar',
    'status',
    'visao',
  ])
})
