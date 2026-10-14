import assert from 'node:assert/strict'
import { test } from 'node:test'
import { novoJogo } from '../../src/core/jogo.js'

const PALAVRAS = [
  { palavra: 'ABACAXI', categoria: 'Fruta' },
  { palavra: 'ELEFANTE', categoria: 'Animal' },
  { palavra: 'COMPUTADOR', categoria: 'Objeto' },
  { palavra: 'JANELA', categoria: 'Objeto' },
  { palavra: 'BICICLETA', categoria: 'Veículo' },
  { palavra: 'CHOCOLATE', categoria: 'Alimento' },
  { palavra: 'GIRASSOL', categoria: 'Natureza' },
  { palavra: 'MONTANHA', categoria: 'Natureza' },
  { palavra: 'PRAIA', categoria: 'Lugar' },
  { palavra: 'FUTEBOL', categoria: 'Esporte' },
  { palavra: 'BORBOLETA', categoria: 'Animal' },
  { palavra: 'CACHORRO', categoria: 'Animal' },
  { palavra: 'AÇÚCAR', categoria: 'Alimento' },
  { palavra: 'CORAÇÃO', categoria: 'Corpo' },
  { palavra: 'PÁSSARO', categoria: 'Animal' },
  { palavra: 'MÚSICA', categoria: 'Arte' },
  { palavra: 'ÁRVORE', categoria: 'Natureza' },
  { palavra: 'FELICIDADE', categoria: 'Sentimento' },
  { palavra: 'AVENTURA', categoria: 'Experiência' },
  { palavra: 'ESCOLA', categoria: 'Lugar' },
  { palavra: 'BIBLIOTECA', categoria: 'Lugar' },
  { palavra: 'CAMINHÃO', categoria: 'Veículo' },
  { palavra: 'FOGUETE', categoria: 'Veículo' },
  { palavra: 'GELADEIRA', categoria: 'Objeto' },
  { palavra: 'TELEFONE', categoria: 'Objeto' },
  { palavra: 'ESTRELA', categoria: 'Natureza' },
  { palavra: 'JARDIM', categoria: 'Lugar' },
  { palavra: 'QUEIJO', categoria: 'Alimento' },
  { palavra: 'CARNAVAL', categoria: 'Festa' },
  { palavra: 'SERTÃO', categoria: 'Lugar' },
]

test('todas as 30 servem para novoJogo', () => {
  for (const item of PALAVRAS) {
    assert.doesNotThrow(() => novoJogo(item.palavra, { categoria: item.categoria }))
  }
})
