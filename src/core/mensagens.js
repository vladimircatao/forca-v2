/**
 * Traduz um código de erro da jogada para o texto exibido ao jogador.
 * @param {string} codigo
 * @returns {string}
 */
export function mensagemDeErro(codigo) {
  const mensagens = {
    letra_repetida: 'Você já tentou essa letra.',
    entrada_invalida: 'Digite uma única letra de A a Z.',
    jogo_encerrado: 'O jogo já terminou.',
  }

  if (!Object.hasOwn(mensagens, codigo)) {
    throw new RangeError(`código de erro desconhecido: ${codigo}`)
  }

  return mensagens[codigo]
}
