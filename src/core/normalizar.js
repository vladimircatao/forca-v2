// Normalização de palavras e letras do núcleo.
//
// Exporta:
// - normalizarPalavra(texto): maiúsculas, sem marcas de acento.
// - normalizarLetra(entrada): usa normalizarPalavra; se o resultado for
//   exatamente uma letra A–Z, devolve-a; senão lança JogadaInvalida('entrada_invalida').

import { JogadaInvalida } from './tipos.js'

/** @param {string} texto */
export function normalizarPalavra(texto) {
  // NFD separa letras e marcas; removemos marcas (\p{M}) e transformamos em maiúsculas.
  // Mantemos espaços e símbolos (validação é responsabilidade de quem chama).
  return texto.normalize('NFD').replace(/\p{M}/gu, '').toUpperCase()
}

/** @param {string} entrada */
export function normalizarLetra(entrada) {
  const resultado = normalizarPalavra(entrada)
  if (/^[A-Z]$/.test(resultado)) {
    return resultado
  }
  throw new JogadaInvalida('entrada_invalida')
}
