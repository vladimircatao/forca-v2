# Arquitetura — Jogo da Forca (JavaScript)

## 1. Ideia central

Três camadas, com dependências em um só sentido:

```
src/app  ──usa──▶  src/ui  ──usa──▶  src/core
(liga tudo)        (DOM e canvas)    (regras puras)
```

- **`src/core/`** — regras do jogo. Funções puras: mesma entrada, mesma saída. **Não conhece** página, canvas, `localStorage`, relógio nem `Math.random`. É 100% testável com `node --test`.
- **`src/ui/`** — transforma a `Visao` em pixels e texto (`tela.js`, `canvas.js`). Não decide nada sobre o jogo. Importa só `core/desenho.js` e `core/mensagens.js`.
- **`src/app/`** — `app.js` (`iniciarApp`) recebe de fora tudo o que é "do mundo" (página, contexto 2D, armazenamento, gerador) e liga eventos às funções do núcleo. `main.js` é o único arquivo que toca `window`/`document` globais; fica com poucas linhas e sem lógica.

O `eslint` impede o núcleo de usar `document`, `window`, `localStorage`, `Date` e `Math.random`.

## 2. Princípios

1. **Estado imutável.** `jogar` devolve um *novo* estado congelado (`Object.freeze`); nunca altera o recebido.
2. **Estado mínimo.** Guarda-se `palavra`, `categoria`, `maxErros`, `tentativas`. Erros, status e máscara são *derivados* por função.
3. **A interface só vê a `Visao`.** O `Estado` contém a palavra secreta; a `Visao` só a traz quando o jogo acaba (R10).
4. **Erro esperado ≠ erro de programação.** Jogada recusada lança `JogadaInvalida(codigo)`. Dados impossíveis (`novoJogo('')`, `maxErros: 0`) lançam `RangeError`.
5. **Aleatoriedade injetada.** Quem sorteia recebe `rng`.
6. **A tela é função do estado.** `renderizar(doc, visao, aviso)` pode ser chamada quantas vezes quiser e sempre deixa a página igual para a mesma entrada.
7. **O canvas é uma casca fina.** O que é desenhado é decidido por `planoDeDesenho` (pura, testável); `desenharForca` só traduz o plano em chamadas ao contexto 2D.

## 3. Tipos (arquivo `src/core/tipos.js`)

```js
/** @typedef {'em_andamento' | 'venceu' | 'perdeu'} Status */
/** @typedef {{ palavra: string, categoria: string, maxErros: number, tentativas: readonly string[] }} Estado */
/** @typedef {{ mascara: string, categoria: string, tentativas: readonly string[], erros: number,
 *              maxErros: number, status: Status, palavra: string | null }} Visao */
export class JogadaInvalida extends Error { codigo }   // 'entrada_invalida' | 'letra_repetida' | 'jogo_encerrado' | 'salvamento_invalido'
```

## 4. API pública do núcleo (`src/core/index.js`)

| Função | Arquivo | Resumo |
|---|---|---|
| `normalizarPalavra(texto)` | `normalizar.js` | maiúsculas, sem acento |
| `normalizarLetra(entrada)` | `normalizar.js` | uma letra A–Z ou `JogadaInvalida('entrada_invalida')` |
| `criarRng(semente)` | `rng.js` | gerador reproduzível em [0,1) |
| `escolher(rng, lista)` | `rng.js` | item sorteado; `RangeError` se vazia |
| `PALAVRAS` | `palavras.js` | 30 `{ palavra, categoria }` |
| `novoJogo(palavra, { categoria, maxErros })` | `jogo.js` | cria o `Estado` |
| `erros(estado)` | `jogo.js` | tentativas que não pertencem à palavra |
| `status(estado)` | `jogo.js` | `em_andamento`, `venceu` ou `perdeu` |
| `jogar(estado, entrada)` | `jogo.js` | novo `Estado` ou `JogadaInvalida` |
| `mascara(estado)` / `visao(estado)` | `visao.js` | o que o jogador pode ver |
| `mensagemDeErro(codigo)`, `mensagemFinal(visao)`, `mensagemDaJogada(letra, acertou)` | `mensagens.js` | textos |
| `etapaDoDesenho(erros, max)`, `planoDeDesenho(erros, max)` | `desenho.js` | o que desenhar |
| `serializar(estado)`, `desserializar(texto)` | `serializar.js` | salvar/carregar |

Ordem das verificações em `jogar`: **`jogo_encerrado` → `entrada_invalida` → `letra_repetida`**.

## 5. Interface

| Função | Arquivo | Resumo |
|---|---|---|
| `montarTeclado(doc, aoEscolher)` | `ui/tela.js` | cria os 26 botões em `#teclado` |
| `renderizar(doc, visao, aviso)` | `ui/tela.js` | atualiza máscara, dica, erros, aviso, teclado e botão "Novo jogo" |
| `desenharForca(ctx, erros, max)` | `ui/canvas.js` | limpa e desenha o plano |
| `iniciarApp({ doc, ctx, rng, armazenamento })` | `app/app.js` | carrega/sorteia, liga cliques e teclado, salva |

## 6. Estrutura de pastas

```
index.html            página (carrega src/app/main.js como módulo)
styles/forca.css
src/core/             regras puras
src/ui/               DOM e canvas
src/app/              ligação com o navegador
tests/core|ui|app/    um arquivo de teste por módulo (node --test)
docs/                 especificação, arquitetura, issues, metodologia
```

## 7. Estratégia de testes

- Framework: `node:test` + `node:assert/strict` (nada para instalar).
- Núcleo: testes diretos, sem simulação de navegador.
- Interface e app: `jsdom` cria uma página de verdade a partir do `index.html`; o canvas é um objeto falso que só registra as chamadas.
- Acessibilidade: `axe-core` roda dentro do jsdom (`tests/ui`).
- Cada "Comportamento esperado" de uma issue vira pelo menos um `test(...)` com nome em português.
- `npm run check` = `eslint` + `prettier --check` + `node --test`. É o que o CI executa.

## 8. Decisões de projeto que valem lembrar

- JavaScript puro com módulos ES (`"type": "module"`), sem TypeScript e sem *bundler*: dá para abrir o código e entender, e o navegador executa o que está no repositório.
- O tipo é documentado com JSDoc; o editor ajuda sem exigir compilação.
- Nomes de identificadores em português sem acento (`novoJogo`, `mascara`); textos da tela, comentários e docs em português do Brasil.
