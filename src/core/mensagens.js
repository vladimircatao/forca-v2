const mensagensDeErro = Object.freeze({
  letra_repetida: 'Você já tentou essa letra.',
  entrada_invalida: 'Digite uma única letra de A a Z.',
  jogo_encerrado: 'O jogo já terminou.',
})

/**
 * Traduza um código de erro em texto legível para o jogador.
 * @param {string} codigo
 * @returns {string}
 */
export function mensagemDeErro(codigo) {
  if (Object.hasOwn(mensagensDeErro, codigo)) {
    return mensagensDeErro[codigo]
  }

  throw new RangeError('código inválido')
}

/**
 * Produz a mensagem final de uma partida.
 * @param {{ status: 'em_andamento' | 'venceu' | 'perdeu', palavra: string | null }} visao
 * @returns {string | null}
 */
export function mensagemFinal(visao) {
  if (visao.status === 'em_andamento') {
    return null
  }

  if (visao.status === 'venceu') {
    return `Parabéns! Você descobriu a palavra: ${visao.palavra}`
  }

  if (visao.status === 'perdeu') {
    return `Fim de jogo. A palavra era: ${visao.palavra}`
  }

  throw new RangeError('status inválido')
}
