# Especificação — Jogo da Forca (navegador, JavaScript + canvas)

Este documento diz **o que** o jogo faz. O **como** (módulos, funções, tipos) está em `ARQUITETURA.md`. Se algo aqui contradiz uma issue, vale a issue mais recente aprovada pelo professor; avise antes de seguir.

## 1. Visão geral

Jogo da forca para um jogador, em uma página web. O computador sorteia uma palavra em português de uma lista fixa de 30 e mostra apenas a **categoria** (dica) e uma linha de lacunas. O jogador escolhe letras, uma por vez. Cada letra errada acrescenta uma parte ao boneco desenhado num `<canvas>`. Ganha quem descobre a palavra antes do 6º erro.

Sem servidor, sem login, sem bibliotecas no navegador. O progresso fica salvo no próprio navegador.

## 2. Regras do jogo

| # | Regra |
|---|---|
| R1 | A palavra é sorteada da lista de 30 (`PALAVRAS`). O jogador vê a categoria e uma lacuna `_` por letra. |
| R2 | São permitidos **6 erros** (`maxErros = 6`). O sexto erro encerra o jogo com derrota. |
| R3 | Uma jogada é **uma letra**. Maiúscula/minúscula e acento não importam: `é`, `E` e `e` são a letra `E`; `ç` é `C`. |
| R4 | Se a entrada, depois de normalizada, não for exatamente uma letra de A a Z (vazia, dois caracteres, número, símbolo, `ß`), a jogada é **recusada** com `entrada_invalida`. Não conta como erro nem como tentativa. |
| R5 | Letra já tentada: recusada com `letra_repetida`. Não conta erro. |
| R6 | **Acerto:** todas as ocorrências da letra são reveladas, **com o acento original** da palavra (`AÇÚCAR` com as letras `a` e `u` → `A _ Ú _ A _`). |
| R7 | **Erro:** a letra não está na palavra. Soma 1 erro e aparece mais uma parte do boneco. |
| R8 | **Vitória:** todas as letras (normalizadas) da palavra foram tentadas. **Derrota:** `erros >= maxErros`. |
| R9 | Depois do fim, qualquer jogada é recusada com `jogo_encerrado`. Esse código tem **prioridade** sobre `entrada_invalida` e `letra_repetida`. |
| R10 | A palavra secreta **só é mostrada ao fim** (vitória ou derrota). Durante o jogo ela não pode aparecer na tela, no HTML, no que a interface recebe nem em mensagens. |
| R11 | "Novo jogo" sorteia outra palavra (pode, por acaso, repetir a anterior). |
| R12 | A partida é salva no navegador a cada jogada. Ao recarregar a página, continua de onde parou. Salvamento corrompido ou indisponível é ignorado em silêncio: começa um jogo novo. |
| R13 | O teclado físico também joga: pressionar uma letra equivale a clicar nela. Teclas com Ctrl, Alt ou Meta, e teclas que não são letras, são ignoradas. |

## 3. Como a tela funciona

Estrutura da página, de cima para baixo (os `id` são parte do contrato):

1. Título `Jogo da Forca` (`<h1>`).
2. `canvas#desenho` — 200 × 250 (coordenadas lógicas), com `role="img"`.
3. `p#categoria` — `Dica: Fruta` (vazio se a categoria for vazia).
4. `p#mascara` — letras separadas por espaço: `A _ A _ A _ _`.
5. `p#erros` — `Erros: 1 de 6`.
6. `p#aviso` — `role="status"`, `aria-live="polite"`: feedback da última jogada ou mensagem de fim.
7. `div#teclado` — 26 botões `A`–`Z` (`data-letra`), `role="group"`.
8. `button#novo` — "Novo jogo"; **escondido** (`hidden`) durante a partida, visível ao fim.

A tela é **função do estado**: a cada jogada a página inteira é recalculada a partir da `Visao`; nenhuma regra do jogo mora na interface.

### Estados da tela

| Situação | Máscara | Teclado | Aviso | "Novo jogo" |
|---|---|---|---|---|
| Início | só lacunas | tudo habilitado | vazio | escondido |
| Acertou `A` em ABACAXI | `A _ A _ A _ _` | `A` desabilitado | `Acertou! A letra A está na palavra.` | escondido |
| Errou `Z` | inalterada | `Z` desabilitado | `Errou. A letra Z não está na palavra.` | escondido |
| Repetiu `Z` | inalterada | — | `Você já tentou essa letra.` | escondido |
| Venceu | palavra completa | tudo desabilitado | `Parabéns! Você descobriu a palavra: ABACAXI` | visível |
| Perdeu | lacunas restantes | tudo desabilitado | `Fim de jogo. A palavra era: ABACAXI` | visível |

## 4. Textos exatos (pt-BR)

- `letra_repetida` → `Você já tentou essa letra.`
- `entrada_invalida` → `Digite uma única letra de A a Z.`
- `jogo_encerrado` → `O jogo já terminou.`
- Vitória → `Parabéns! Você descobriu a palavra: <PALAVRA>`
- Derrota → `Fim de jogo. A palavra era: <PALAVRA>`
- Acerto → `Acertou! A letra <L> está na palavra.`
- Erro → `Errou. A letra <L> não está na palavra.`
- Contador → `Erros: <n> de <max>`; dica → `Dica: <categoria>`.

## 5. O desenho

Área lógica **200 × 250**. A estrutura (4 linhas) aparece sempre; o boneco (6 partes) aparece uma a uma:

| Parte | Forma | Dados |
|---|---|---|
| base | linha | (20,230) → (140,230) |
| poste | linha | (50,230) → (50,20) |
| trave | linha | (50,20) → (130,20) |
| corda | linha | (130,20) → (130,50) |
| 1 cabeça | círculo | centro (130,70), raio 20 |
| 2 tronco | linha | (130,90) → (130,150) |
| 3 braço esquerdo | linha | (130,105) → (105,135) |
| 4 braço direito | linha | (130,105) → (155,135) |
| 5 perna esquerda | linha | (130,150) → (110,190) |
| 6 perna direita | linha | (130,150) → (150,190) |

**Etapa** = quantas partes do boneco aparecem: `0` se não há erros; senão `min(6, max(1, floor(erros * 6 / maxErros)))`. Com `maxErros = 6`, etapa = erros. Com `maxErros = 3`, os erros 1, 2, 3 dão as etapas 2, 4, 6.

O canvas usa traço de 4 px, cor `#222`, pontas arredondadas, e é limpo a cada redesenho.

## 6. Palavras

30 palavras em MAIÚSCULAS, com acentos, cada uma com categoria. Sem repetição (comparando sem acento), 4 letras ou mais, só letras. Lista oficial em `src/core/palavras.js` (issue #7).

## 7. Aleatoriedade

O núcleo nunca chama `Math.random`. O sorteio recebe um gerador `rng()` (devolve número em [0, 1)). Em produção usa-se `criarRng(Date.now())`; nos testes, valores fixos (`() => 0` sorteia ABACAXI; `() => 0.5` sorteia MÚSICA).

## 8. Persistência

Chave `forca:jogo` no `localStorage`. Conteúdo: JSON com `versao: 1`, `palavra`, `categoria`, `maxErros`, `tentativas`. Erros e status **não** são guardados: são recalculados refazendo as jogadas. Qualquer anomalia (JSON inválido, versão diferente, letra repetida, tipos errados) = `salvamento_invalido` = ignorar e começar do zero.

## 9. Acessibilidade e qualidade

- `<html lang="pt-BR">`, título da página, `<main>`, um só `<h1>`.
- Botões reais (`<button type="button">`) com foco visível e alvo mínimo de 2,75 rem.
- Máscara com `aria-label` ("Palavra: A, lacuna, A, ...") e aviso com `aria-live`.
- Zero violações no axe-core (regra de contraste desligada no teste, porque o jsdom não calcula estilos).
- Funciona em celular (layout fluido, `viewport`).

## 10. Fora do escopo

Dois jogadores; palavra digitada pelo usuário; níveis de dificuldade; ranking; sons e animações; chutar a palavra inteira; dicas extras; internacionalização; backend; PWA.
