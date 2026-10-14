/**
 * Deixa o texto em maiúsculas e sem acento (regra R3). Não valida o conteúdo.
 * @param {string} texto
 * @returns {string}
 */
export function normalizarPalavra(texto) {
  // NFD separa a letra da marca de acento; depois as marcas (\p{M}) são removidas.
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()
}
