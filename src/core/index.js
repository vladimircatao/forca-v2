// API pública do núcleo: um só lugar para ver tudo o que src/core oferece.
// Módulos em ordem alfabética, conforme docs/ARQUITETURA.md §4.
export { ALTURA, ETAPAS, LARGURA, etapaDoDesenho, planoDeDesenho } from './desenho.js'
export { erros, jogar, novoJogo, status } from './jogo.js'
export { mensagemDaJogada, mensagemDeErro, mensagemFinal } from './mensagens.js'
export { normalizarLetra, normalizarPalavra } from './normalizar.js'
export { PALAVRAS } from './palavras.js'
export { criarRng, escolher } from './rng.js'
export { desserializar, serializar } from './serializar.js'
export { JogadaInvalida } from './tipos.js'
export { mascara, visao } from './visao.js'
