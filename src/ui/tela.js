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

/**
 * Atualiza a interface visual da partida.
 * @param {Document} doc
 * @param {{ mascara: string, categoria: string, erros: number, maxErros: number, tentativas?: string[], status?: string }} visao
 * @param {string} [aviso='']
 * @returns {void}
 */
export function renderizar(doc, visao, aviso = '') {
  const mascara = doc.getElementById('mascara')

  if (mascara) {
    const letras = visao.mascara.split('')
    const texto = letras.join(' ')
    mascara.textContent = texto
    mascara.setAttribute(
      'aria-label',
      `Palavra: ${letras
        .map((letra) => (letra === '_' ? 'lacuna' : letra))
        .join(', ')}`,
    )
  }

  const categoria = doc.getElementById('categoria')

  if (categoria) {
    categoria.textContent = visao.categoria ? `Dica: ${visao.categoria}` : ''
  }

  const erros = doc.getElementById('erros')

  if (erros) {
    erros.textContent = `Erros: ${visao.erros} de ${visao.maxErros}`
  }

  const botoes = doc.querySelectorAll('#teclado button')

  for (const botao of botoes) {
    const letra = botao.dataset.letra
    const estaTentada = visao.tentativas?.includes(letra) ?? false
    const jogoAcabou = visao.status !== 'em_andamento'
    botao.disabled = estaTentada || jogoAcabou
  }

  if (aviso) {
    const avisoEl = doc.getElementById('aviso')

    if (avisoEl) {
      avisoEl.textContent = aviso
    }
  }
}
