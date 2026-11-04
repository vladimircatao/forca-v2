import { novoJogo } from '../core/jogo.js'
import { PALAVRAS } from '../core/palavras.js'
import { escolher } from '../core/rng.js'
import { visao } from '../core/visao.js'
import { desenharForca } from '../ui/canvas.js'
import { montarTeclado, renderizar } from '../ui/tela.js'

export const CHAVE = 'forca:jogo'

/**
 * Inicia uma partida sorteada e monta a interface inicial.
 * @param {{ doc: Document, ctx: CanvasRenderingContext2D, rng: () => number, armazenamento?: unknown }} entrada
 * @returns {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }}
 */
export function iniciarApp({ doc, ctx, rng, armazenamento = null }) {
  if (!doc || !ctx || typeof rng !== 'function') {
    throw new TypeError('iniciarApp precisa de doc, ctx e rng válidos')
  }

  void armazenamento

  const palavraSorteada = escolher(rng, PALAVRAS)
  const estado = novoJogo(palavraSorteada.palavra, { categoria: palavraSorteada.categoria })

  montarTeclado(doc, () => {})

  const visaoAtual = visao(estado)
  renderizar(doc, visaoAtual)
  desenharForca(ctx, visaoAtual.erros, visaoAtual.maxErros)

  return estado
}
