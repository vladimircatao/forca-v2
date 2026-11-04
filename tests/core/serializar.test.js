import assert from 'node:assert/strict'
import { test } from 'node:test'
import { jogar, novoJogo } from '../../src/core/jogo.js'
import { desserializar, serializar } from '../../src/core/serializar.js'
import { JogadaInvalida } from '../../src/core/tipos.js'

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

test('desserializar faz ida e volta do estado com AÇÚCAR e tentativas a, u, z', () => {
  let estado = novoJogo('AÇÚCAR', { categoria: 'Comida', maxErros: 4 })
  estado = jogar(estado, 'a')
  estado = jogar(estado, 'u')
  estado = jogar(estado, 'z')

  const recuperado = desserializar(serializar(estado))

  assert.deepEqual(recuperado, estado)
})

test('desserializar devolve estado congelado que continua jogável', () => {
  const recuperado = desserializar(
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":6,"tentativas":["C"]}',
  )

  assert.equal(Object.isFrozen(recuperado), true)
  assert.equal(Object.isFrozen(recuperado.tentativas), true)

  const aposJogada = jogar(recuperado, 'z')
  assert.deepEqual(aposJogada.tentativas, ['C', 'Z'])
  assert.deepEqual(recuperado.tentativas, ['C'])
})

test('desserializar lança salvamento_invalido para salvamentos inválidos', () => {
  const entradasInvalidas = [
    'não é json',
    '',
    'null',
    '[]',
    '{"versao":2}',
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":6,"tentativas":["C","C"]}',
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":6,"tentativas":[1]}',
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":6,"tentativas":"CA"}',
    '{"versao":1,"palavra":"","categoria":"Lugar","maxErros":6,"tentativas":[]}',
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":0,"tentativas":[]}',
    '{"versao":1,"palavra":"CASA","categoria":123,"maxErros":6,"tentativas":[]}',
    '{"versao":1,"palavra":"CASA","categoria":"Lugar","maxErros":1,"tentativas":["Z","X"]}',
  ]

  for (const texto of entradasInvalidas) {
    assert.throws(
      () => desserializar(texto),
      (erro) => erro instanceof JogadaInvalida && erro.codigo === 'salvamento_invalido',
    )
  }
})
