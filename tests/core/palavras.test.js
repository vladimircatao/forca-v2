import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PALAVRAS } from '../../src/core/palavras.js'

function semAcento(texto) {
  return texto.normalize('NFD').replace(/\p{M}/gu, '')
}

const ESPERADAS = [
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

test('tem 30 palavras na ordem oficial', () => {
  assert.equal(PALAVRAS.length, 30)
  assert.deepEqual(PALAVRAS, ESPERADAS)
})

test('itens obrigatórios batem com os valores literais', () => {
  assert.deepEqual(PALAVRAS[0], { palavra: 'ABACAXI', categoria: 'Fruta' })
  assert.equal(PALAVRAS[12].palavra, 'AÇÚCAR')
  assert.deepEqual(PALAVRAS[15], { palavra: 'MÚSICA', categoria: 'Arte' })
})

test('não repete palavras quando ignora acentos', () => {
  const unicas = new Set(PALAVRAS.map((item) => semAcento(item.palavra)))
  assert.equal(unicas.size, PALAVRAS.length)
})

test('cada palavra normalizada segue o formato e fica em maiúsculas', () => {
  for (const item of PALAVRAS) {
    const normalizada = semAcento(item.palavra)
    assert.match(normalizada, /^[A-Z]{4,}$/)
    assert.equal(item.palavra, item.palavra.toUpperCase())
  }
})

test('todas as categorias são não vazias', () => {
  for (const item of PALAVRAS) {
    assert.equal(item.categoria.trim().length > 0, true)
  }
})

test('lista e itens são imutáveis', () => {
  assert.equal(Object.isFrozen(PALAVRAS), true)
  for (const item of PALAVRAS) {
    assert.equal(Object.isFrozen(item), true)
  }
})

test('não permite alterar a lista nem os itens', () => {
  assert.throws(() => {
    PALAVRAS.push(Object.freeze({ palavra: 'TESTE', categoria: 'Teste' }))
  }, TypeError)

  assert.throws(() => {
    PALAVRAS[0].palavra = 'LARANJA'
  }, TypeError)
})
