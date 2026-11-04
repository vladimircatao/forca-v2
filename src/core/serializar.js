import { erros, jogar, novoJogo } from './jogo.js'
import { JogadaInvalida } from './tipos.js'

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

/**
 * Recupera um estado de partida salvo em JSON.
 * @param {string} texto
 * @returns {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }}
 */
export function desserializar(texto) {
  try {
    const dados = JSON.parse(texto)
    if (dados === null || Array.isArray(dados)) {
      throw new RangeError('salvamento inválido')
    }

    const { versao, palavra, categoria, maxErros, tentativas } = dados

    if (versao !== 1) {
      throw new RangeError('versão inválida')
    }

    if (typeof palavra !== 'string' || typeof categoria !== 'string' || !Array.isArray(tentativas)) {
      throw new RangeError('tipos inválidos')
    }

    let estado = novoJogo(palavra, { categoria, maxErros })
    for (const tentativa of tentativas) {
      estado = jogar(estado, tentativa)
    }

    if (erros(estado) > estado.maxErros) {
      throw new RangeError('erros inválidos')
    }

    return estado
  } catch {
    throw new JogadaInvalida('salvamento_invalido')
  }
}
