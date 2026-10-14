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
