/**
 * Quantidade de partes visíveis do boneco.
 * @param {number} numErros
 * @param {number} [maxErros=6]
 * @returns {number}
 */
export const ETAPAS = 6

export function etapaDoDesenho(numErros, maxErros = 6) {
  if (!Number.isInteger(numErros) || numErros < 0) {
    throw new RangeError('numErros inválido')
  }

  if (!Number.isInteger(maxErros) || maxErros < 1) {
    throw new RangeError('maxErros inválido')
  }

  if (numErros === 0) {
    return 0
  }

  return Math.min(ETAPAS, Math.max(1, Math.floor((numErros * ETAPAS) / maxErros)))
}
