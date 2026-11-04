import { normalizarPalavra } from './normalizar.js'

/**
 * Serializa o estado para persistência.
 * @param {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} estado
 * @returns {string}
 */
export function serializar(estado) {
  const tentativas = estado.tentativas.map((tentativa) => normalizarPalavra(tentativa))

  return JSON.stringify({
    versao: 1,
    palavra: estado.palavra,
    categoria: estado.categoria,
    maxErros: estado.maxErros,
    tentativas,
  })
}
