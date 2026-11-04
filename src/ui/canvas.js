import { ALTURA, LARGURA, planoDeDesenho } from '../core/desenho.js'

/**
 * Desenha a forca e as partes correspondentes aos erros da partida.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} numErros
 * @param {number} maxErros
 * @returns {void}
 */
export function desenharForca(ctx, numErros, maxErros) {
  ctx.clearRect(0, 0, LARGURA, ALTURA)
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#222'

  for (const forma of planoDeDesenho(numErros, maxErros)) {
    ctx.beginPath()

    if (forma.tipo === 'linha') {
      ctx.moveTo(forma.x1, forma.y1)
      ctx.lineTo(forma.x2, forma.y2)
    } else {
      ctx.arc(forma.x, forma.y, forma.r, 0, Math.PI * 2)
    }

    ctx.stroke()
  }
}
