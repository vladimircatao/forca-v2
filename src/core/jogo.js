import { normalizarPalavra } from './normalizar.js'

/**
 * Conta quantas tentativas não pertencem à palavra.
 * @param {{ palavra: string, tentativas: readonly string[] }} estado
 * @returns {number}
 */
export function erros(estado) {
  const letrasDaPalavra = new Set(normalizarPalavra(estado.palavra).split(''))

  return estado.tentativas.reduce((total, tentativa) => {
    const letra = normalizarPalavra(tentativa)
    return total + (letrasDaPalavra.has(letra) ? 0 : 1)
  }, 0)
}

/**
 * Cria um novo estado de jogo.
 * @param {string} palavra
 * @param {{ categoria?: string, maxErros?: number }} [opcoes]
 * @returns {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }}
 */
export function novoJogo(palavra, { categoria = '', maxErros = 6 } = {}) {
  const palavraMaiuscula = palavra.toUpperCase()
  const palavraSemAcento = palavraMaiuscula.normalize('NFD').replace(/\p{M}/gu, '')

  if (!/^[A-Z]+$/.test(palavraSemAcento)) {
    throw new RangeError('palavra inválida')
  }

  if (!Number.isInteger(maxErros) || maxErros < 1) {
    throw new RangeError('maxErros inválido')
  }

  const tentativas = Object.freeze([])

  return Object.freeze({
    palavra: palavraMaiuscula,
    categoria,
    maxErros,
    tentativas,
  })
}
