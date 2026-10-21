/**
 * Deixa o texto em maiúsculas e sem acento (regra R3). Não valida o conteúdo.
 * @param {string} texto
 * @returns {string}
 */
export function normalizarPalavra(texto) {
  // Regra R3: o jogador digita sem acento, então comparamos a forma sem marcas.
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()
}
