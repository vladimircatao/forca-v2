/** @typedef {'em_andamento' | 'venceu' | 'perdeu'} Status */
/** @typedef {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} Estado */
/** @typedef {{ mascara: string, categoria: string, tentativas: readonly string[], erros: number,
 *              maxErros: number, status: Status, palavra: string | null }} Visao */

export class JogadaInvalida extends Error {
  constructor(codigo) {
    super(codigo)
    this.codigo = codigo
    this.name = 'JogadaInvalida'
  }
}
