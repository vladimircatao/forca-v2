<!--
FORMATO (lido por scripts/criar-issues.mjs):
- Cada issue começa com `### #N — Título`. N é sequencial a partir de 1 e DEVE coincidir com o número que o GitHub vai atribuir (repositório sem issues nem PRs).
- Metadados: **Labels:**, **Pai:**, **Depende de:**, **Dono sugerido:** (A, B ou C; só informativo), **Commit esperado:**.
- O script acrescenta, no fim de cada tarefa, a "Definição de pronto" e as instruções para o agente.
- Cada issue é lida pelo Copilot como PEDIDO COMPLETO: tudo o que ele precisa saber está na própria issue.
-->

### #1 — [Épico] Jogo da Forca — piloto
**Labels:** epico

**Objetivo:** jogo da forca completo no navegador (JavaScript puro + canvas), com regras puras testáveis, interface acessível, progresso salvo e publicação no GitHub Pages, construído com a metodologia: issues pequenas, comportamento esperado definido por humanos, agente de código, gate de compreensão.

**Critério de saída:**
- `npm run dev` abre um jogo completo em http://localhost:8000.
- `npm run check` verde localmente e no CI.
- Todo "Comportamento esperado" coberto por teste automático.
- Cada PR com o gate de compreensão preenchido pelo aluno.
- Jogo publicado numa URL do GitHub Pages.

**Divisão sugerida em trio:** A = regras (#2, #8 a #15, #24); B = dados, textos, desenho e salvamento (#3 a #7, #16 a #23); C = interface e publicação (#25 a #39). A issue #2 é feita pelos três juntos, em sala.

**Ordem de trabalho:** respeite "Depende de". Pessoas diferentes podem trabalhar em paralelo em issues sem dependência entre si; os conflitos de merge que aparecerem (por exemplo em `src/core/index.js`) fazem parte do exercício.

### #2 — Definir o contrato do jogo: o erro JogadaInvalida
**Labels:** core
**Pai:** #1
**Depende de:** nenhuma
**Dono sugerido:** A (feita pelo trio, em sala)
**Commit esperado:** `feat(core): define o contrato do jogo`

**Contexto:** vocabulário comum de todo o código. Leia `docs/ARQUITETURA.md` §3.

**Especificação:** criar `src/core/tipos.js` com:
- Definições de tipo em JSDoc (`@typedef`) para `Status`, `Estado` e `Visao`, exatamente como em `docs/ARQUITETURA.md` §3.
- `export class JogadaInvalida extends Error` com construtor `(codigo)` que chama `super(codigo)`, guarda `this.codigo` e define `this.name = 'JogadaInvalida'`.
- Remover `tests/ambiente.test.js` neste commit (era só para o CI não ficar vazio).

**Comportamento esperado:**
- `new JogadaInvalida('letra_repetida').codigo` é `'letra_repetida'`.
- `new JogadaInvalida('letra_repetida').message` é `'letra_repetida'`.
- É `instanceof Error` e `instanceof JogadaInvalida`.
- `.name` é `'JogadaInvalida'`.

**Fora do escopo:** qualquer função do jogo; validar se o código é conhecido.

**Arquivos:** `src/core/tipos.js`, `tests/core/tipos.test.js` (e remoção de `tests/ambiente.test.js`).

### #3 — Normalizar palavras (maiúsculas, sem acento)
**Labels:** dados
**Pai:** #1
**Depende de:** #2
**Dono sugerido:** B
**Commit esperado:** `feat(core): normaliza palavras sem acento`

**Contexto:** regra R3: acento não importa para o jogador. Leia `docs/ESPECIFICACAO.md` §2.

**Especificação:** em `src/core/normalizar.js`, `export function normalizarPalavra(texto)`: devolve o texto em MAIÚSCULAS e sem marcas de acento. Dica: `texto.normalize('NFD')` separa a letra da marca; depois remova as marcas com `/\p{M}/gu` e use `toUpperCase()`. Não valida o conteúdo.

**Comportamento esperado:**
- `'Açúcar'` → `'ACUCAR'`
- `'coração'` → `'CORACAO'`
- `'ÃÕ'` → `'AO'`
- `'casa'` → `'CASA'`
- `''` → `''`
- `'a b'` → `'A B'` (espaço e símbolos são mantidos; quem valida é outra função)

**Fora do escopo:** validar se só tem letras; `normalizarLetra` (issue #4).

**Arquivos:** `src/core/normalizar.js`, `tests/core/normalizar.test.js`.

### #4 — Normalizar e validar a letra digitada
**Labels:** dados
**Pai:** #1
**Depende de:** #2, #3
**Dono sugerido:** B
**Commit esperado:** `feat(core): valida a letra digitada`

**Contexto:** regras R3 e R4.

**Especificação:** em `src/core/normalizar.js`, `export function normalizarLetra(entrada)`: usa `normalizarPalavra`; se o resultado for exatamente uma letra de `A` a `Z` (regex `/^[A-Z]$/`), devolve-o; caso contrário lança `new JogadaInvalida('entrada_invalida')`.

**Comportamento esperado:**
- Aceita: `'a'`→`'A'`, `'A'`→`'A'`, `'é'`→`'E'`, `'Ç'`→`'C'`, `'ã'`→`'A'`, `'é'` (e + acento combinante) → `'E'`.
- Recusa com `codigo === 'entrada_invalida'`: `''`, `' '`, `'ab'`, `'1'`, `'!'`, `'ß'`, `'a '` (espaço depois da letra).

**Fora do escopo:** verificar letra repetida (issue #12) ou fim de jogo (issue #13).

**Arquivos:** `src/core/normalizar.js`, `tests/core/normalizar.test.js`.

### #5 — Gerador de números aleatórios com semente
**Labels:** dados
**Pai:** #1
**Depende de:** nenhuma
**Dono sugerido:** B
**Commit esperado:** `feat(core): cria o gerador com semente`

**Contexto:** o núcleo não pode usar `Math.random` (o ESLint barra), senão os testes não seriam repetíveis. Leia `docs/ARQUITETURA.md` §2.

**Especificação:** em `src/core/rng.js`, `export function criarRng(semente)` devolve uma função sem argumentos que, a cada chamada, devolve um número em `[0, 1)`. Use exatamente o algoritmo mulberry32:
```js
export function criarRng(semente) {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

**Comportamento esperado:**
- Dois geradores com a mesma semente (42) dão exatamente a mesma sequência de 100 números.
- Todos os números ficam em `[0, 1)`.
- Sementes 1 e 2 dão primeiros valores diferentes.

**Fora do escopo:** escolher itens de uma lista (issue #6).

**Arquivos:** `src/core/rng.js`, `tests/core/rng.test.js`.

### #6 — Escolher um item da lista com o gerador
**Labels:** dados
**Pai:** #1
**Depende de:** #5
**Dono sugerido:** B
**Commit esperado:** `feat(core): sorteia um item da lista`

**Especificação:** em `src/core/rng.js`, `export function escolher(rng, lista)`: devolve `lista[Math.floor(rng() * lista.length)]`. Lista vazia lança `new RangeError('a lista está vazia')`.

**Comportamento esperado:**
- `escolher(() => 0, ['a','b','c'])` → `'a'`
- `escolher(() => 0.5, ['a','b','c'])` → `'b'`
- `escolher(() => 0.999, ['a','b','c'])` → `'c'`
- `escolher(() => 0, [])` lança `RangeError`.

**Fora do escopo:** a lista de palavras (issue #7).

**Arquivos:** `src/core/rng.js`, `tests/core/rng.test.js`.

### #7 — Lista das 30 palavras
**Labels:** dados
**Pai:** #1
**Depende de:** #3
**Dono sugerido:** B
**Commit esperado:** `feat(core): inclui a lista de 30 palavras`

**Contexto:** `docs/ESPECIFICACAO.md` §6. A ORDEM importa: os testes de interface sorteiam por posição.

**Especificação:** em `src/core/palavras.js`, `export const PALAVRAS`: `Object.freeze` de 30 itens, cada um também congelado, no formato `{ palavra, categoria }`, exatamente nesta ordem (índice: palavra, categoria):
0 ABACAXI Fruta · 1 ELEFANTE Animal · 2 COMPUTADOR Objeto · 3 JANELA Objeto · 4 BICICLETA Veículo · 5 CHOCOLATE Alimento · 6 GIRASSOL Natureza · 7 MONTANHA Natureza · 8 PRAIA Lugar · 9 FUTEBOL Esporte · 10 BORBOLETA Animal · 11 CACHORRO Animal · 12 AÇÚCAR Alimento · 13 CORAÇÃO Corpo · 14 PÁSSARO Animal · 15 MÚSICA Arte · 16 ÁRVORE Natureza · 17 FELICIDADE Sentimento · 18 AVENTURA Experiência · 19 ESCOLA Lugar · 20 BIBLIOTECA Lugar · 21 CAMINHÃO Veículo · 22 FOGUETE Veículo · 23 GELADEIRA Objeto · 24 TELEFONE Objeto · 25 ESTRELA Natureza · 26 JARDIM Lugar · 27 QUEIJO Alimento · 28 CARNAVAL Festa · 29 SERTÃO Lugar.

**Comportamento esperado:**
- `PALAVRAS.length` é 30; sem repetição mesmo ignorando acentos.
- Cada palavra, normalizada, casa com `/^[A-Z]{4,}$/` e está em MAIÚSCULAS; toda categoria é não vazia.
- A lista e cada item estão congelados (`Object.isFrozen`).
- `PALAVRAS[0]` é `{ palavra: 'ABACAXI', categoria: 'Fruta' }`; `PALAVRAS[12].palavra` é `'AÇÚCAR'`; `PALAVRAS[15]` é `{ palavra: 'MÚSICA', categoria: 'Arte' }`.
- Todas servem para `novoJogo(palavra)` sem erro (este teste só passa depois da issue #8; escreva-o na issue #8).

**Fora do escopo:** adicionar, remover ou reordenar palavras.

**Arquivos:** `src/core/palavras.js`, `tests/core/palavras.test.js`.

### #8 — Criar a partida (novoJogo)
**Labels:** core
**Pai:** #1
**Depende de:** #2, #3
**Dono sugerido:** A
**Commit esperado:** `feat(core): cria a partida com novoJogo`

**Contexto:** `docs/ARQUITETURA.md` §2 (estado imutável e mínimo).

**Especificação:** em `src/core/jogo.js`, `export function novoJogo(palavra, { categoria = '', maxErros = 6 } = {})` devolve um objeto **congelado** `{ palavra, categoria, maxErros, tentativas }`, em que `palavra` é o texto em MAIÚSCULAS **mantendo os acentos** (`palavra.toUpperCase()`) e `tentativas` é um array **congelado e vazio**. Dados impossíveis lançam `RangeError`: palavra cuja versão normalizada não casa com `/^[A-Z]+$/`; `maxErros` que não seja inteiro `>= 1`.

**Comportamento esperado:**
- `novoJogo('casa', { categoria: 'Lugar' })` → `palavra 'CASA'`, `categoria 'Lugar'`, `maxErros 6`, `tentativas` vazio.
- `novoJogo('AÇÚCAR').palavra` é `'AÇÚCAR'` (acento mantido).
- O objeto e `tentativas` estão congelados.
- Lança `RangeError`: `novoJogo('')`, `novoJogo('ca sa')`, `novoJogo('c4sa')`, `novoJogo('casa', { maxErros: 0 })`, `novoJogo('casa', { maxErros: 2.5 })`.
- Acrescente também ao teste de `tests/core/palavras.test.js` o caso "todas as 30 servem para `novoJogo`".

**Fora do escopo:** jogar, contar erros, calcular status.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`, `tests/core/palavras.test.js`.

### #9 — Contar os erros
**Labels:** core
**Pai:** #1
**Depende de:** #8
**Dono sugerido:** A
**Commit esperado:** `feat(core): conta os erros da partida`

**Especificação:** em `src/core/jogo.js`, `export function erros(estado)`: quantas letras de `estado.tentativas` NÃO pertencem à palavra (comparando a palavra já normalizada com `normalizarPalavra`). Como `jogar` ainda não existe, o teste monta o estado à mão: `{ ...novoJogo('CASA'), tentativas: ['C', 'Z'] }`.

**Comportamento esperado:**
- Sem tentativas → 0.
- `CASA` com tentativas `['C','Z']` → 1; com `['C','A','S']` → 0; com `['Z','X','W']` → 3.
- `AÇÚCAR` com tentativas `['U','C']` → 0 (acento não conta como letra diferente).

**Fora do escopo:** status, jogar.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`.

### #10 — Calcular o status da partida
**Labels:** core
**Pai:** #1
**Depende de:** #9
**Dono sugerido:** A
**Commit esperado:** `feat(core): calcula o status da partida`

**Especificação:** em `src/core/jogo.js`, `export function status(estado)` devolve `'venceu'` se todas as letras (normalizadas, sem repetir) da palavra estão em `tentativas`; senão `'perdeu'` se `erros(estado) >= estado.maxErros`; senão `'em_andamento'`. Vitória é verificada primeiro. O teste monta estados à mão, como na issue #9.

**Comportamento esperado (palavra CASA, maxErros 6):**
- Tentativas `[]` → `'em_andamento'`.
- `['C','A']` → `'em_andamento'`; `['C','A','S']` → `'venceu'`.
- `['Z','X','W','K','Y']` (5 erros) → `'em_andamento'`; `['Z','X','W','K','Y','Q']` (6 erros) → `'perdeu'`.
- Com `maxErros: 2`, `['Z','X']` → `'perdeu'`.
- `AÇÚCAR` com `['A','C','U','R']` → `'venceu'`.

**Fora do escopo:** jogar, visão.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`.

### #11 — Jogada: aplicar a letra
**Labels:** core
**Pai:** #1
**Depende de:** #4, #8
**Dono sugerido:** A
**Commit esperado:** `feat(core): aplica a letra na partida`

**Contexto:** regras R3, R4, R6, R7.

**Especificação:** em `src/core/jogo.js`, `export function jogar(estado, entrada)`: `normalizarLetra(entrada)` (que já lança `entrada_invalida`) e devolve um NOVO estado congelado `{ ...estado, tentativas: [...estado.tentativas, letra] }` com o array também congelado. O estado recebido **não pode ser alterado**. Nesta issue ainda não se trata letra repetida nem fim de jogo.

**Comportamento esperado:**
- `jogar(novoJogo('CASA'), 'c').tentativas` é `['C']`.
- O estado original continua com `tentativas` vazio depois da jogada.
- O novo estado e o novo array de tentativas estão congelados.
- Acento é a mesma letra: `jogar(novoJogo('AÇÚCAR'), 'u')` não conta erro (`erros(...)` é 0) e guarda `'U'`.
- Letra errada conta erro: `erros(jogar(novoJogo('CASA'), 'z'))` é 1.
- Entrada inválida (`'1'`, `'ab'`, `''`) lança `JogadaInvalida` com `codigo 'entrada_invalida'`.

**Fora do escopo:** letra repetida, jogo encerrado.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`.

### #12 — Jogada: recusar letra repetida
**Labels:** core
**Pai:** #1
**Depende de:** #11
**Dono sugerido:** A
**Commit esperado:** `feat(core): recusa a letra repetida`

**Contexto:** regra R5.

**Especificação:** em `jogar`, depois de normalizar a letra, se ela já está em `estado.tentativas`, lança `new JogadaInvalida('letra_repetida')`. A ordem passa a ser: normalizar/validar (`entrada_invalida`) → repetida.

**Comportamento esperado:**
- Jogar `'z'` e depois `'Z'` lança `codigo 'letra_repetida'`.
- Jogar `'a'` e depois `'á'` também (acento é a mesma letra).
- Repetir não altera o número de erros nem as tentativas do estado anterior.
- Entrada inválida repetida continua sendo `entrada_invalida`: `jogar(e, '1')` duas vezes lança `entrada_invalida` nas duas.

**Fora do escopo:** jogo encerrado.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`.

### #13 — Jogada depois do fim do jogo
**Labels:** core
**Pai:** #1
**Depende de:** #10, #12
**Dono sugerido:** A
**Commit esperado:** `feat(core): recusa jogadas após o fim`

**Contexto:** regra R9. `jogo_encerrado` vence qualquer outro erro.

**Especificação:** em `jogar`, a **primeira** verificação passa a ser: se `status(estado) !== 'em_andamento'`, lança `new JogadaInvalida('jogo_encerrado')`. Ordem final: `jogo_encerrado` → `entrada_invalida` → `letra_repetida`.

**Comportamento esperado (palavra CASA):**
- Depois de vencer (`c`,`a`,`s`), jogar `'z'` lança `jogo_encerrado`.
- Depois de perder (`z`,`x`,`w`,`k`,`y`,`q`), jogar `'c'` lança `jogo_encerrado`.
- Prioridade: depois do fim, `jogar(fim, '1')` e `jogar(fim, 'c')` (repetida) lançam `jogo_encerrado`, não os outros códigos.
- O sexto erro é aceito (a derrota acontece nele); só a jogada seguinte é recusada.

**Fora do escopo:** mensagens de texto.

**Arquivos:** `src/core/jogo.js`, `tests/core/jogo.test.js`.

### #14 — Máscara da palavra
**Labels:** visao
**Pai:** #1
**Depende de:** #3, #8
**Dono sugerido:** A
**Commit esperado:** `feat(core): monta a máscara da palavra`

**Contexto:** regra R6: a letra revelada aparece com o acento original.

**Especificação:** em `src/core/visao.js`, `export function mascara(estado)`: uma string do mesmo tamanho da palavra; cada caractere é o original se sua versão normalizada está em `tentativas`, senão `'_'`.

**Comportamento esperado:**
- `CASA` sem tentativas → `'____'`; com `['A']` → `'_A_A'`; com `['C','A','S']` → `'CASA'`.
- `AÇÚCAR` com `['A','U']` → `'A_Ú_A_'` (acento original mantido).
- `AÇÚCAR` com `['C']` → `'_Ç_C__'` (o `Ç` normaliza para `C`, então as posições 1 e 3 são reveladas, cada uma com o seu caractere original).
- O tamanho da máscara é sempre igual ao da palavra.

**Fora do escopo:** `visao`, espaçar letras (isso é da tela).

**Arquivos:** `src/core/visao.js`, `tests/core/visao.test.js`.

### #15 — Visão do jogador (esconder a palavra)
**Labels:** visao
**Pai:** #1
**Depende de:** #10, #14
**Dono sugerido:** A
**Commit esperado:** `feat(core): cria a visão do jogador`

**Contexto:** regra R10. A interface só recebe a `Visao`.

**Especificação:** em `src/core/visao.js`, `export function visao(estado)` devolve objeto congelado `{ mascara, categoria, tentativas, erros, maxErros, status, palavra }`, em que `palavra` é `null` enquanto `status` for `'em_andamento'` e a palavra com acentos quando for `'venceu'` ou `'perdeu'`.

**Comportamento esperado (CASA):**
- Visão inicial: `mascara '____'`, `categoria ''`, `tentativas []`, `erros 0`, `maxErros 6`, `status 'em_andamento'`, `palavra null`.
- Após `a`: `mascara '_A_A'`. Após `c`,`z`: `tentativas ['C','Z']`, `erros 1`.
- Durante o jogo, `JSON.stringify(visao)` **não contém** `'CASA'`.
- Após perder: `status 'perdeu'`, `palavra 'CASA'`, `mascara '____'` (a máscara continua mostrando só o que o jogador acertou).
- Após vencer: `status 'venceu'`, `palavra 'CASA'`, `mascara 'CASA'`.
- A visão está congelada.

**Fora do escopo:** textos de fim de jogo.

**Arquivos:** `src/core/visao.js`, `tests/core/visao.test.js`.

### #16 — Mensagens de erro da jogada
**Labels:** visao
**Pai:** #1
**Depende de:** #2
**Dono sugerido:** B
**Commit esperado:** `feat(core): traduz os códigos de erro em texto`

**Contexto:** textos exatos em `docs/ESPECIFICACAO.md` §4.

**Especificação:** em `src/core/mensagens.js`, `export function mensagemDeErro(codigo)`. Use um objeto com as três chaves e verifique com `Object.hasOwn`; código desconhecido lança `RangeError`.

**Comportamento esperado:**
- `'letra_repetida'` → `Você já tentou essa letra.`
- `'entrada_invalida'` → `Digite uma única letra de A a Z.`
- `'jogo_encerrado'` → `O jogo já terminou.`
- `'outra'` e `'toString'` lançam `RangeError`.

**Fora do escopo:** o código `salvamento_invalido` (nunca é mostrado ao jogador).

**Arquivos:** `src/core/mensagens.js`, `tests/core/mensagens.test.js`.

### #17 — Mensagem de fim de jogo
**Labels:** visao
**Pai:** #1
**Depende de:** #15, #16
**Dono sugerido:** B
**Commit esperado:** `feat(core): cria a mensagem de fim de jogo`

**Especificação:** em `src/core/mensagens.js`, `export function mensagemFinal(visao)`: `null` se `em_andamento`; senão o texto de vitória ou derrota (§4 da especificação).

**Comportamento esperado (CASA):**
- Em andamento → `null`.
- Vitória → `Parabéns! Você descobriu a palavra: CASA`.
- Derrota → `Fim de jogo. A palavra era: CASA`.

**Fora do escopo:** mensagens de acerto/erro (issue #18).

**Arquivos:** `src/core/mensagens.js`, `tests/core/mensagens.test.js`.

### #18 — Mensagem de acerto ou erro da jogada
**Labels:** visao
**Pai:** #1
**Depende de:** #16
**Dono sugerido:** B
**Commit esperado:** `feat(core): cria a mensagem de acerto ou erro`

**Especificação:** em `src/core/mensagens.js`, `export function mensagemDaJogada(letra, acertou)`: `letra` já normalizada (A–Z); `acertou` booleano.

**Comportamento esperado:**
- `mensagemDaJogada('A', true)` → `Acertou! A letra A está na palavra.`
- `mensagemDaJogada('Z', false)` → `Errou. A letra Z não está na palavra.`

**Fora do escopo:** decidir se acertou (quem chama calcula).

**Arquivos:** `src/core/mensagens.js`, `tests/core/mensagens.test.js`.

### #19 — Etapa do desenho
**Labels:** visao
**Pai:** #1
**Depende de:** nenhuma
**Dono sugerido:** B
**Commit esperado:** `feat(core): calcula a etapa do desenho`

**Contexto:** `docs/ESPECIFICACAO.md` §5: o boneco tem 6 partes, mesmo que `maxErros` seja diferente de 6.

**Especificação:** em `src/core/desenho.js`: `export const ETAPAS = 6` e `export function etapaDoDesenho(numErros, maxErros = 6)`: `0` se `numErros` é 0; senão `Math.min(ETAPAS, Math.max(1, Math.floor((numErros * ETAPAS) / maxErros)))`. Argumentos fora do domínio (`numErros` não inteiro ou `< 0`; `maxErros` não inteiro ou `< 1`) lançam `RangeError`.

**Comportamento esperado:**
- `maxErros 6`: erros `0,1,2,3,4,5,6` → `0,1,2,3,4,5,6`.
- `maxErros 3`: erros `0,1,2,3` → `0,2,4,6`.
- `etapaDoDesenho(9, 6)` → `6` (limitado).
- `etapaDoDesenho(1, 10)` → `1` (quem errou aparece com pelo menos uma parte).
- `etapaDoDesenho(5, 10)` → `3`.
- `etapaDoDesenho(-1, 6)` e `etapaDoDesenho(0, 0)` lançam `RangeError`.

**Fora do escopo:** formas geométricas (issue #20).

**Arquivos:** `src/core/desenho.js`, `tests/core/desenho.test.js`.

### #20 — Plano do desenho (lista de formas)
**Labels:** visao
**Pai:** #1
**Depende de:** #19
**Dono sugerido:** B
**Commit esperado:** `feat(core): cria o plano do desenho`

**Contexto:** o canvas não é testável; por isso decidimos QUE formas desenhar numa função pura, e só traduzimos para o canvas na issue #30.

**Especificação:** em `src/core/desenho.js`: `export const LARGURA = 200`, `export const ALTURA = 250` e `export function planoDeDesenho(numErros, maxErros = 6)` que devolve um array congelado com as 4 formas da estrutura (sempre) seguidas das primeiras `etapaDoDesenho(...)` partes do boneco, na ordem da tabela de `docs/ESPECIFICACAO.md` §5. Cada forma é um objeto congelado: linha `{ tipo: 'linha', nome, x1, y1, x2, y2 }` ou círculo `{ tipo: 'circulo', nome, x, y, r }`. Nomes: `base`, `poste`, `trave`, `corda`, `cabeca`, `tronco`, `braco_esquerdo`, `braco_direito`, `perna_esquerda`, `perna_direita`. Coordenadas exatamente como na tabela.

**Comportamento esperado:**
- O plano tem `4 + etapa` formas, para erros de 0 a 6 (`maxErros 6`).
- A última forma com 1 erro é `cabeca` (círculo, centro (130,70), raio 20); com 6 erros é `perna_direita`.
- Cada erro só ACRESCENTA formas: o plano de `n` erros é um prefixo do plano de `n+1`.
- O plano com 0 erros tem exatamente `base`, `poste`, `trave`, `corda`.
- As formas e o plano estão congelados.

**Fora do escopo:** desenhar no canvas.

**Arquivos:** `src/core/desenho.js`, `tests/core/desenho.test.js`.

### #21 — Serializar a partida
**Labels:** dados
**Pai:** #1
**Depende de:** #13
**Dono sugerido:** B
**Commit esperado:** `feat(core): serializa a partida`

**Contexto:** regra R12 e `docs/ESPECIFICACAO.md` §8.

**Especificação:** em `src/core/serializar.js`, `export function serializar(estado)` devolve `JSON.stringify` de `{ versao: 1, palavra, categoria, maxErros, tentativas }` (só esses campos, nessa ordem).

**Comportamento esperado:**
- `JSON.parse(serializar(...))` de `CASA` (categoria `'Lugar'`) com tentativas `c`,`z` é igual a `{ versao: 1, palavra: 'CASA', categoria: 'Lugar', maxErros: 6, tentativas: ['C','Z'] }`.
- Erros e status **não** aparecem no texto.

**Fora do escopo:** ler de volta (issue #22); `localStorage`.

**Arquivos:** `src/core/serializar.js`, `tests/core/serializar.test.js`.

### #22 — Desserializar a partida
**Labels:** dados
**Pai:** #1
**Depende de:** #21
**Dono sugerido:** B
**Commit esperado:** `feat(core): recupera a partida salva`

**Especificação:** em `src/core/serializar.js`, `export function desserializar(texto)`: interpreta o JSON, confere `versao === 1`, os tipos (`palavra` e `categoria` são strings; `tentativas` é array), recria com `novoJogo` e **refaz cada jogada com `jogar`** (assim qualquer salvamento adulterado é pego pelas próprias regras). Qualquer problema — inclusive `RangeError` do `novoJogo` ou `JogadaInvalida` do `jogar` — vira `throw new JogadaInvalida('salvamento_invalido')`. Dica: um único `try/catch` em volta de tudo.

**Comportamento esperado:**
- Ida e volta: `desserializar(serializar(e))` é igual a `e` (`deepEqual`), por exemplo para `AÇÚCAR` com `maxErros 4` e tentativas `a`,`u`,`z`.
- O estado devolvido é congelado e continua jogável.
- Lançam `salvamento_invalido`: `'não é json'`, `''`, `'null'`, `'[]'`, `{"versao":2}`, letra repetida (`["C","C"]`), tentativa que não é texto (`[1]`), `tentativas` que não é array (`"CA"`), palavra vazia, `maxErros` 0, `categoria` numérica, e mais erros do que `maxErros` permite.

**Fora do escopo:** `localStorage` (issue #35).

**Arquivos:** `src/core/serializar.js`, `tests/core/serializar.test.js`.

### #23 — Reunir a API pública do núcleo
**Labels:** core
**Pai:** #1
**Depende de:** #22, #20, #18, #17, #15, #13, #7, #6
**Dono sugerido:** B
**Commit esperado:** `feat(core): reúne a API pública do núcleo`

**Especificação:** `src/core/index.js` reexporta, com `export { ... } from`, exatamente os nomes da tabela de `docs/ARQUITETURA.md` §4, mais `ETAPAS`, `LARGURA`, `ALTURA` e `JogadaInvalida`. Ordem alfabética dos módulos. Daqui em diante `src/ui` e `src/app` importam do núcleo pelos módulos que precisarem (não precisam usar o `index.js`).

**Comportamento esperado:** `Object.keys(import * as nucleo)` ordenado é exatamente: `ALTURA, ETAPAS, JogadaInvalida, LARGURA, PALAVRAS, criarRng, desserializar, erros, escolher, etapaDoDesenho, jogar, mascara, mensagemDaJogada, mensagemDeErro, mensagemFinal, normalizarLetra, normalizarPalavra, novoJogo, planoDeDesenho, serializar, status, visao` (22 nomes).

**Fora do escopo:** novas funções.

**Arquivos:** `src/core/index.js`, `tests/core/index.test.js`.

### #24 — Simular partidas completas
**Labels:** qualidade
**Pai:** #1
**Depende de:** #23
**Dono sugerido:** A
**Commit esperado:** `test(core): simula partidas completas`

**Contexto:** teste de integração do núcleo: jogar partidas inteiras com "robôs" determinísticos.

**Especificação:** em `tests/core/simulacao.test.js`, importando só de `src/core/index.js`, defina dois robôs: um que **conhece a palavra** (joga cada letra normalizada distinta) e um que **só erra** (joga letras A–Z que não estão na palavra, até o jogo acabar). Rode-os nas 30 palavras.

**Comportamento esperado:**
- O robô que conhece a palavra vence, com 0 erros, `palavra` revelada e máscara sem `_`, nas 30 palavras.
- O robô que só erra faz exatamente 6 jogadas; a sequência de erros é `1,2,3,4,5,6`; os 5 primeiros status são `em_andamento` e o final é `perdeu`.
- Enquanto em andamento, `visao.palavra` é `null` e o JSON da visão **não contém** a palavra.
- Com a mesma semente (`criarRng(2026)`) e as mesmas jogadas, o estado final é idêntico em duas execuções.

**Fora do escopo:** alterar código de `src/`.

**Arquivos:** `tests/core/simulacao.test.js`.

### #25 — Página HTML e estilo
**Labels:** ui
**Pai:** #1
**Depende de:** nenhuma
**Dono sugerido:** C
**Commit esperado:** `feat(ui): cria a página do jogo`

**Contexto:** `docs/ESPECIFICACAO.md` §3 e §9. Os `id` abaixo são contrato com o resto do código.

**Especificação:** criar `index.html` (`<html lang="pt-BR">`, `<meta charset>`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>Jogo da Forca</title>`, `<link rel="icon" href="data:,">` (evita o erro 404 do favicon), `<link rel="stylesheet" href="styles/forca.css">`) e, dentro de um `<main>`: `<h1>Jogo da Forca</h1>`; `<canvas id="desenho" width="200" height="250" role="img" aria-label="Desenho da forca">`; `<p id="categoria">`; `<p id="mascara" class="mascara">`; `<p id="erros">`; `<p id="aviso" role="status" aria-live="polite">`; `<div id="teclado" role="group" aria-label="Teclado de letras">`; `<button id="novo" type="button" hidden>Novo jogo</button>`. No fim do `<body>`: `<script type="module" src="src/app/main.js"></script>`. Criar `styles/forca.css`: fonte `system-ui`; `main` centralizado com largura máxima de `32rem`; `canvas` com `max-width: 100%` e `height: auto`; `.mascara` monoespaçada, com `font-size: clamp(1.25rem, 6vw, 2rem)` e `letter-spacing: 0.05em` (a palavra mais longa, com 10 letras, tem que caber em uma linha numa tela de 420 px); `#teclado` em `flex-wrap`, botões com `min-width` e `min-height` de `2.75rem`; foco visível (`:focus-visible` com contorno de 3px); `button:disabled` com `opacity: 0.5`.

**Comportamento esperado** (teste com `jsdom` lendo o `index.html`, sem executar scripts):
- `html[lang]` é `pt-BR`; `document.title` é `Jogo da Forca`; há exatamente um `h1`.
- Existem os 7 elementos com os `id` acima; `#desenho` tem `width` 200 e `height` 250; `#novo` tem `hidden`; `#aviso` tem `role="status"`.
- Existe `meta[name=viewport]` e um `script[type=module]` apontando para `src/app/main.js`.

**Fora do escopo:** criar os botões do teclado (issue #26); qualquer JavaScript.

**Arquivos:** `index.html`, `styles/forca.css`, `tests/ui/pagina.test.js`.

### #26 — Criar o teclado de letras
**Labels:** ui
**Pai:** #1
**Depende de:** #25
**Dono sugerido:** C
**Commit esperado:** `feat(ui): cria o teclado de letras`

**Especificação:** em `src/ui/tela.js`: `export const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'` e `export function montarTeclado(doc, aoEscolher)`: substitui os filhos de `#teclado` (`replaceChildren`) por 26 `<button type="button">`, com `textContent` e `dataset.letra` iguais à letra; ao clicar, chama `aoEscolher(letra)`.

**Comportamento esperado** (jsdom):
- Há 26 botões em `#teclado`, na ordem A–Z, todos `type="button"`.
- Clicar no botão `K` chama `aoEscolher` uma vez com `'K'`.
- Chamar `montarTeclado` duas vezes continua deixando 26 botões (não duplica).

**Fora do escopo:** habilitar/desabilitar botões (issue #28).

**Arquivos:** `src/ui/tela.js`, `tests/ui/tela.test.js`.

### #27 — Mostrar máscara, dica e erros
**Labels:** ui
**Pai:** #1
**Depende de:** #15, #25
**Dono sugerido:** C
**Commit esperado:** `feat(ui): mostra o estado da partida`

**Especificação:** em `src/ui/tela.js`, `export function renderizar(doc, v, aviso = '')` — nesta issue só escreve em `#mascara`, `#categoria` e `#erros` (as outras partes vêm nas issues #28 e #29):
- `#mascara`: `textContent` com as letras da máscara separadas por um espaço (`'_A_A'` → `'_ A _ A'`); `aria-label` = `Palavra: ` + letras separadas por vírgula e espaço, com `lacuna` no lugar de `_` (`Palavra: lacuna, A, lacuna, A`).
- `#categoria`: `Dica: <categoria>`, ou vazio se a categoria for vazia.
- `#erros`: `Erros: <erros> de <maxErros>`.

**Comportamento esperado** (visão de `CASA`, categoria `Lugar`, após `a` e `z`):
- `#mascara` → `_ A _ A`; `aria-label` → `Palavra: lacuna, A, lacuna, A`.
- `#categoria` → `Dica: Lugar`; sem categoria → texto vazio.
- `#erros` → `Erros: 1 de 6`.
- Chamar duas vezes com a mesma visão deixa a página igual (idempotente).

**Fora do escopo:** teclado, aviso, botão "Novo jogo".

**Arquivos:** `src/ui/tela.js`, `tests/ui/tela.test.js`.

### #28 — Desabilitar as letras já tentadas
**Labels:** ui
**Pai:** #1
**Depende de:** #26, #27
**Dono sugerido:** C
**Commit esperado:** `feat(ui): desabilita as letras já tentadas`

**Especificação:** em `renderizar`, cada botão de `#teclado` fica `disabled` se a letra está em `v.tentativas` **ou** se o jogo acabou (`v.status !== 'em_andamento'`).

**Comportamento esperado** (jsdom, `CASA`):
- Início: nenhum botão desabilitado.
- Após `a` e `z`: só `A` e `Z` desabilitados; `B` habilitado.
- Jogo acabado (vitória ou derrota): os 26 desabilitados.

**Fora do escopo:** aviso, botão "Novo jogo".

**Arquivos:** `src/ui/tela.js`, `tests/ui/tela.test.js`.

### #29 — Mostrar o aviso e o fim de jogo
**Labels:** ui
**Pai:** #1
**Depende de:** #17, #28
**Dono sugerido:** C
**Commit esperado:** `feat(ui): mostra as mensagens do jogo`

**Especificação:** em `renderizar`: `#aviso` recebe `mensagemFinal(v)` quando não é `null`, senão o parâmetro `aviso`; `#novo.hidden` é `true` durante o jogo e `false` ao fim.

**Comportamento esperado** (jsdom, `CASA`):
- Em andamento com `aviso` `'Você já tentou essa letra.'` → `#aviso` mostra essa frase; `#novo` está `hidden`.
- Em andamento sem aviso → `#aviso` vazio.
- Vitória → `Parabéns! Você descobriu a palavra: CASA`; `#novo` visível.
- Derrota → `Fim de jogo. A palavra era: CASA`; `#novo` visível; **a mensagem final vence o parâmetro `aviso`** se os dois existirem.

**Fora do escopo:** o clique em "Novo jogo" (issue #33).

**Arquivos:** `src/ui/tela.js`, `tests/ui/tela.test.js`.

### #30 — Desenhar a forca no canvas
**Labels:** canvas
**Pai:** #1
**Depende de:** #20
**Dono sugerido:** C
**Commit esperado:** `feat(ui): desenha a forca no canvas`

**Contexto:** `docs/ESPECIFICACAO.md` §5. O canvas não roda no jsdom; o teste usa um contexto falso (um `Proxy` que registra, em ordem, o nome e os argumentos dos métodos chamados).

**Especificação:** em `src/ui/canvas.js`, `export function desenharForca(ctx, numErros, maxErros)`: `ctx.clearRect(0, 0, LARGURA, ALTURA)`; depois define `lineWidth = 4`, `lineCap = 'round'`, `strokeStyle = '#222'`; para cada forma de `planoDeDesenho(numErros, maxErros)`: `beginPath()`; linha → `moveTo` e `lineTo`; círculo → `arc(x, y, r, 0, Math.PI * 2)`; e então `stroke()`.

**Comportamento esperado** (contagem de chamadas no contexto falso):
- Com 0 erros: 4 chamadas de `stroke` e 0 de `arc`.
- Com 1 erro: 5 `stroke`, 1 `arc`. Com 6 erros: 10 `stroke`, 1 `arc`.
- `clearRect` é chamado exatamente uma vez por desenho, antes de qualquer `stroke`.
- Os argumentos de `clearRect` são `(0, 0, 200, 250)`.

**Fora do escopo:** cores diferentes, animação.

**Arquivos:** `src/ui/canvas.js`, `tests/ui/canvas.test.js`.

### #31 — Aplicação: iniciar a partida
**Labels:** app
**Pai:** #1
**Depende de:** #23, #29, #30
**Dono sugerido:** C
**Commit esperado:** `feat(app): inicia a partida sorteada`

**Contexto:** `docs/ARQUITETURA.md` §5. `iniciarApp` recebe tudo de fora, por isso é testável.

**Especificação:** em `src/app/app.js`, `export const CHAVE = 'forca:jogo'` e `export function iniciarApp({ doc, ctx, rng, armazenamento = null })`: sorteia a palavra com `escolher(rng, PALAVRAS)`, cria o estado com `novoJogo(palavra, { categoria })`, monta o teclado (`montarTeclado`) e desenha a tela (`renderizar` e `desenharForca` a partir de `visao(estado)`). O estado fica numa variável dentro da função. Esta issue ainda não liga cliques nem salva.

**Comportamento esperado** (jsdom + contexto falso, `rng = () => 0` → ABACAXI):
- `#mascara` → `_ _ _ _ _ _ _`; `#categoria` → `Dica: Fruta`; `#erros` → `Erros: 0 de 6`; `#novo` escondido.
- Há 26 botões no teclado.
- O contexto falso recebeu chamadas de desenho (4 `stroke`).
- A palavra `ABACAXI` não aparece em nenhum texto da página.

**Fora do escopo:** cliques, teclado físico, salvar.

**Arquivos:** `src/app/app.js`, `tests/app/app.test.js`.

### #32 — Aplicação: jogar clicando nas letras
**Labels:** app
**Pai:** #1
**Depende de:** #31
**Dono sugerido:** C
**Commit esperado:** `feat(app): joga ao clicar nas letras`

**Especificação:** em `iniciarApp`, `montarTeclado` recebe uma função `escolherLetra(letra)` que: guarda os erros antes; `estado = jogar(estado, letra)`; redesenha com a mensagem `mensagemDaJogada(letra, errosDepois === errosAntes)`. Se `jogar` lançar `JogadaInvalida`, o estado não muda e a tela é redesenhada com `mensagemDeErro(e.codigo)`. Outros erros não são engolidos (relance).

**Comportamento esperado** (ABACAXI):
- Clicar `A` → `#mascara` `A _ A _ A _ _`; aviso `Acertou! A letra A está na palavra.`; botão `A` desabilitado.
- Clicar `Z` → `Erros: 1 de 6`; aviso `Errou. A letra Z não está na palavra.`; o contexto falso recebeu um `arc` (a cabeça).
- Perder clicando `Z W K Y Q J`: aviso `Fim de jogo. A palavra era: ABACAXI`; `#novo` visível; teclado todo desabilitado.
- Vencer clicando `A B C X I`: aviso `Parabéns! Você descobriu a palavra: ABACAXI`.

**Fora do escopo:** teclado físico; "Novo jogo".

**Arquivos:** `src/app/app.js`, `tests/app/app.test.js`.

### #33 — Aplicação: botão Novo jogo
**Labels:** app
**Pai:** #1
**Depende de:** #32
**Dono sugerido:** C
**Commit esperado:** `feat(app): reinicia com o botão Novo jogo`

**Especificação:** em `iniciarApp`, transforme o sorteio em uma função `sortear()` reutilizada. Clicar em `#novo` faz `estado = sortear()` e redesenha sem aviso.

**Comportamento esperado** (`rng` devolve `0` e depois `0.5`):
- Depois de perder com ABACAXI, clicar `#novo` mostra a palavra de índice 15 (`MÚSICA`): `#categoria` → `Dica: Arte`; `#mascara` → `_ _ _ _ _ _`; `Erros: 0 de 6`; `#novo` volta a ficar escondido; teclado habilitado de novo; `#aviso` vazio.
- Depois de reiniciar, jogar funciona normalmente (clicar `M` revela `M _ _ _ _ _`).

**Fora do escopo:** persistência.

**Arquivos:** `src/app/app.js`, `tests/app/app.test.js`.

### #34 — Aplicação: jogar com o teclado físico
**Labels:** app
**Pai:** #1
**Depende de:** #32
**Dono sugerido:** C
**Commit esperado:** `feat(app): joga com o teclado físico`

**Contexto:** regra R13.

**Especificação:** em `iniciarApp`, `doc.addEventListener('keydown', ...)`: se `ev.ctrlKey`, `ev.altKey` ou `ev.metaKey`, ignora; senão `normalizarPalavra(ev.key)`; se o resultado casa com `/^[A-Z]$/`, chama `escolherLetra`. Teclas como `Enter`, `Shift`, `1` e espaço não casam e são ignoradas (`'Enter'` normalizado é `'ENTER'`, com 5 letras).

**Comportamento esperado** (ABACAXI):
- Tecla `a` → igual a clicar `A`. Tecla `Ç` → conta como `C` (acerta).
- Ignoradas, sem mudar nada: `'1'`, `'Enter'`, `' '`, `'Shift'`, `'!'`, e `z` com `ctrlKey`, `altKey` ou `metaKey`.
- Tecla repetida (`z`, `z`) → aviso `Você já tentou essa letra.` e `Erros: 1 de 6`.
- Depois do fim, qualquer letra mantém a mensagem final.

**Fora do escopo:** foco em campo de texto (a página não tem campos).

**Arquivos:** `src/app/app.js`, `tests/app/app.test.js`.

### #35 — Aplicação: salvar e retomar a partida
**Labels:** app
**Pai:** #1
**Depende de:** #33, #22
**Dono sugerido:** C
**Commit esperado:** `feat(app): persiste a partida no navegador`

**Contexto:** regra R12 e `docs/ESPECIFICACAO.md` §8. `armazenamento` é qualquer objeto com `getItem(chave)` e `setItem(chave, valor)` (na prática, `localStorage`).

**Especificação:** em `iniciarApp`: ao começar, tenta `desserializar(armazenamento.getItem(CHAVE))`; se não houver nada, se o salvamento for inválido ou se o armazenamento lançar erro, sorteia um jogo novo, sem avisar nada ao jogador. A cada redesenho, tenta `armazenamento.setItem(CHAVE, serializar(estado))`, ignorando erros. `armazenamento` pode ser `null`.

**Comportamento esperado:**
- Depois de clicar `A` e `Z`, o armazenamento falso contém `CHAVE` com um JSON válido de versão 1.
- Um novo `iniciarApp` com esse conteúdo mostra `A _ A _ A _ _` e `Erros: 1 de 6` (mesmo com o `rng` apontando para outra palavra).
- Conteúdo `'lixo'` → jogo novo normal (com `rng = () => 0.5`, `Dica: Arte`).
- Armazenamento cujos `getItem` e `setItem` lançam erro → o jogo funciona normalmente.
- `armazenamento: null` → funciona.

**Fora do escopo:** várias partidas salvas; botão de apagar o salvamento.

**Arquivos:** `src/app/app.js`, `tests/app/app.test.js`.

### #36 — Ligar o jogo ao navegador (main.js)
**Labels:** app, manual
**Pai:** #1
**Depende de:** #35
**Dono sugerido:** C
**Commit esperado:** `feat(app): liga o jogo ao navegador`

**Contexto:** `main.js` é o único arquivo que toca `window` e `document` globais; não tem lógica.

**Especificação:** `src/app/main.js`: obtém `armazenamento` de `window.localStorage` dentro de `try/catch` (se o navegador bloquear, fica `null`) e chama `iniciarApp({ doc: document, ctx: document.getElementById('desenho').getContext('2d'), rng: criarRng(Date.now()), armazenamento })`. Sem outra lógica. (`Date.now()` é permitido aqui porque `src/app` não é o núcleo.)

**Comportamento esperado** (verificação **manual**, não há teste automático para este arquivo):
- `npm run dev` e abrir http://localhost:8000: aparece a forca vazia, a dica, as lacunas e 26 botões.
- Clicar numa letra errada desenha a cabeça; seis erros desenham o boneco e mostram a palavra.
- Recarregar a página (F5) no meio da partida retoma o jogo.
- Digitar no teclado funciona.
- Cole no PR um print da tela e o resultado de `npm run check`.

**Fora do escopo:** qualquer outra mudança.

**Arquivos:** `src/app/main.js`.

### #37 — Teste de acessibilidade automático
**Labels:** qualidade
**Pai:** #1
**Depende de:** #36
**Dono sugerido:** C
**Commit esperado:** `test(ui): verifica a acessibilidade com axe`

**Especificação:** em `tests/ui/acessibilidade.test.js`: monta a página no jsdom (`runScripts: 'outside-only'`), chama `iniciarApp` com contexto falso e `rng = () => 0`, injeta o `axe.source` com `window.eval` e roda `window.axe.run(window.document, { rules: { 'color-contrast': { enabled: false } } })`. Teste em três momentos: partida no início, depois de um erro, e depois de perder. Para comparar com `deepEqual`, converta `r.violations` com `Array.from(r.violations, (v) => v.id)` (o array vem de outro contexto do jsdom).

**Comportamento esperado:** nos três momentos, a lista de violações é vazia. Se o axe achar problema, corrija o HTML/CSS (e registre a mudança no PR).

**Fora do escopo:** contraste de cores (o jsdom não calcula estilos).

**Arquivos:** `tests/ui/acessibilidade.test.js` (e ajustes em `index.html`/`styles/forca.css` só se o axe reclamar).

### #38 — Publicar no GitHub Pages
**Labels:** docs, manual
**Pai:** #1
**Depende de:** #36
**Dono sugerido:** C
**Commit esperado:** `ci: publica o jogo no GitHub Pages`

**Contexto:** o workflow `.github/workflows/pages.yml` já está no repositório. O Pages gratuito exige repositório público.

**Especificação (passos manuais):**
1. Repositório público (Settings > General > Danger Zone, se ainda não for).
2. Settings > Pages > Source: **GitHub Actions**.
3. Em `.github/workflows/pages.yml`, acrescente o gatilho `push: branches: [main]` abaixo de `on:` (hoje só há `workflow_dispatch`). Depois do merge, ou rodando manualmente (Actions > Run workflow), o jogo é publicado.
4. Abra a URL mostrada na execução e jogue uma partida completa.
5. Confira se as versões das actions do workflow são as atuais (a doc de cada action mostra a mais recente).

**Comportamento esperado:** o jogo abre na URL pública, com a forca, o teclado e o desenho funcionando; recarregar a página retoma a partida. Anote a URL no PR e no `README.md`.

**Fora do escopo:** domínio próprio; mudar o conteúdo publicado.

**Arquivos:** `.github/workflows/pages.yml`.

### #39 — README do projeto
**Labels:** docs
**Pai:** #1
**Depende de:** #38
**Dono sugerido:** C
**Commit esperado:** `docs: escreve o README do jogo`

**Especificação:** `README.md` na raiz, em português, com: o que é o jogo (2 linhas); link do jogo publicado; como rodar (`npm ci`, `npm run dev`); como testar (`npm run check`); mapa das pastas (`src/core`, `src/ui`, `src/app`, `tests`, `docs`); e uma seção "Como este projeto foi construído" com 3 frases sobre issues, agente de código e gate de compreensão, escrita pelo próprio aluno.

**Comportamento esperado:** um colega que nunca viu o projeto consegue, só com o README, rodar o jogo e os testes. Todos os comandos citados existem no `package.json`.

**Fora do escopo:** documentação de cada função (já está no JSDoc).

**Arquivos:** `README.md`.
