import { erros, status } from './jogo.js'
import { normalizarPalavra } from './normalizar.js'

/**
 * Monta a máscara da palavra com base nas tentativas.
 * @param {{ palavra: string, tentativas: readonly string[] }} estado
 * @returns {string}
 */
export function mascara(estado) {
  const letrasTentadas = new Set(estado.tentativas.map((tentativa) => normalizarPalavra(tentativa)))

  let resultado = ''
  for (const caractere of estado.palavra) {
    const letraNormalizada = normalizarPalavra(caractere)
    resultado += letrasTentadas.has(letraNormalizada) ? caractere : '_'
  }

  return resultado
}

/**
 * Devolve apenas os dados visíveis para a interface.
 * @param {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} estado
 * @returns {{ mascara: string, categoria: string, tentativas: readonly string[], erros: number, maxErros: number, status: 'em_andamento' | 'venceu' | 'perdeu', palavra: string | null }}
 */
export function visao(estado) {
  const statusAtual = status(estado)

  return Object.freeze({
    mascara: mascara(estado),
    categoria: estado.categoria,
    tentativas: estado.tentativas,
    erros: erros(estado),
    maxErros: estado.maxErros,
    status: statusAtual,
    palavra: statusAtual === 'em_andamento' ? null : estado.palavra,
  })
}
