/**
 * Serializa o estado atual da partida para persistência.
 * @param {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} estado
 * @returns {string}
 */
export function serializar(estado) {
  return JSON.stringify({
    versao: 1,
    palavra: estado.palavra,
    categoria: estado.categoria,
    maxErros: estado.maxErros,
    tentativas: estado.tentativas.map((tentativa) => tentativa.toUpperCase()),
  })
}
