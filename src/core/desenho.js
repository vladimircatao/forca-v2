const ESTRUTURA = Object.freeze([
  Object.freeze({ tipo: 'linha', nome: 'base', x1: 20, y1: 230, x2: 140, y2: 230 }),
  Object.freeze({ tipo: 'linha', nome: 'poste', x1: 50, y1: 230, x2: 50, y2: 20 }),
  Object.freeze({ tipo: 'linha', nome: 'trave', x1: 50, y1: 20, x2: 130, y2: 20 }),
  Object.freeze({ tipo: 'linha', nome: 'corda', x1: 130, y1: 20, x2: 130, y2: 50 }),
])

const BONECO = Object.freeze([
  Object.freeze({ tipo: 'circulo', nome: 'cabeca', x: 130, y: 70, r: 20 }),
  Object.freeze({ tipo: 'linha', nome: 'tronco', x1: 130, y1: 90, x2: 130, y2: 150 }),
  Object.freeze({ tipo: 'linha', nome: 'braco_esquerdo', x1: 130, y1: 105, x2: 105, y2: 135 }),
  Object.freeze({ tipo: 'linha', nome: 'braco_direito', x1: 130, y1: 105, x2: 155, y2: 135 }),
  Object.freeze({ tipo: 'linha', nome: 'perna_esquerda', x1: 130, y1: 150, x2: 110, y2: 190 }),
  Object.freeze({ tipo: 'linha', nome: 'perna_direita', x1: 130, y1: 150, x2: 150, y2: 190 }),
])

export const LARGURA = 200
export const ALTURA = 250
export const ETAPAS = 6

/**
 * Converte a quantidade de erros na etapa de desenho (0 a 6).
 * @param {number} numErros
 * @param {number} [maxErros]
 * @returns {number}
 */
export function etapaDoDesenho(numErros, maxErros = ETAPAS) {
  if (!Number.isInteger(numErros) || numErros < 0) {
    throw new RangeError('numErros inválido')
  }

  if (!Number.isInteger(maxErros) || maxErros < 1) {
    throw new RangeError('maxErros inválido')
  }

  if (numErros === 0) {
    return 0
  }

  const etapaEscalonada = Math.floor((numErros * ETAPAS) / maxErros)
  return Math.min(ETAPAS, Math.max(1, etapaEscalonada))
}

/**
 * Monta o plano de desenho da forca para o canvas.
 * @param {number} numErros
 * @param {number} [maxErros]
 * @returns {readonly Readonly<Record<string, number | string>>[]}
 */
export function planoDeDesenho(numErros, maxErros = ETAPAS) {
  const etapa = etapaDoDesenho(numErros, maxErros)
  return Object.freeze([...ESTRUTURA, ...BONECO.slice(0, etapa)])
}
