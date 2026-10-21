/**
 * Sequência de letras do alfabeto em maiúsculas.
 * @type {string}
 */
export const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Cria os botões do teclado de letras.
 * @param {Document} doc
 * @param {(letra: string) => void} aoEscolher
 * @returns {void}
 */
export function montarTeclado(doc, aoEscolher) {
  const teclado = doc.getElementById('teclado')

  if (!teclado) {
    throw new Error('elemento #teclado não encontrado')
  }

  const botoes = []

  for (const letra of LETRAS) {
    const botao = doc.createElement('button')
    botao.type = 'button'
    botao.textContent = letra
    botao.dataset.letra = letra
    botao.addEventListener('click', () => {
      aoEscolher(letra)
    })
    botoes.push(botao)
  }

  teclado.replaceChildren(...botoes)
}
