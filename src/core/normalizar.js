// Normalização de palavras e letras do núcleo.
//
// Exporta:
// - normalizarPalavra(texto): maiúsculas, sem marcas de acento.
// - normalizarLetra(entrada): usa normalizarPalavra; se o resultado for
//   exatamente uma letra A–Z, devolve-a; senão lança JogadaInvalida('entrada_invalida').

import { JogadaInvalida } from './tipos.js'

/**
 * Deixa o texto em maiúsculas e sem acento. Não valida o conteúdo.
 * @param {string} texto
 * @returns {string}
 */
export function normalizarPalavra(texto) {
  // Regra R3: o jogador digita sem acento, então comparamos a forma sem marcas.
  // Espaços e símbolos ficam: quem valida é normalizarLetra.
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
