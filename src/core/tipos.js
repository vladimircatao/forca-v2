/** @typedef {'em_andamento' | 'venceu' | 'perdeu'} Status */
/** @typedef {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} Estado */
/** @typedef {{ mascara: string, categoria: string, tentativas: readonly string[], erros: number,
 *              maxErros: number, status: Status, palavra: string | null }} Visao */

/**
 * Jogada recusada pelas regras (erro esperado, não de programação).
 * Códigos: 'entrada_invalida' | 'letra_repetida' | 'jogo_encerrado' | 'salvamento_invalido'.
 */
export class JogadaInvalida extends Error {
  /** @param {string} codigo motivo da recusa */
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
    this.name = 'JogadaInvalida'
  }
}
