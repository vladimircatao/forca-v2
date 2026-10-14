# DECISIONS — Jogo da Forca (JavaScript)

Só decisões relevantes. Formato: contexto, decisão, justificativa. Escrito por humanos.

## 2026-10-14 — D01: JavaScript puro, módulos ES, sem bundler
**Contexto:** iniciantes (Python básico); o jogo roda no navegador, com canvas.
**Decisão:** `"type": "module"`, sem TypeScript, sem framework; tipos em JSDoc.
**Justificativa:** o navegador executa exatamente o que está no repositório; nada para configurar.

## 2026-10-14 — D02: Núcleo puro e injeção de dependências
**Contexto:** testes precisam ser repetíveis e rápidos.
**Decisão:** `src/core` não usa DOM, `localStorage`, `Date` nem `Math.random` (o ESLint barra). Sorteio recebe `rng`; `iniciarApp` recebe página, contexto 2D e armazenamento.
**Justificativa:** quase tudo se testa com `node --test`, sem navegador.

## 2026-10-14 — D03: Jogada recusada = exceção JogadaInvalida(codigo)
**Contexto:** a versão em TypeScript do projeto de batalha naval usava `Result`.
**Decisão:** exceção com `codigo` (`entrada_invalida`, `letra_repetida`, `jogo_encerrado`, `salvamento_invalido`); `RangeError` para dado impossível.
**Justificativa:** mais próximo do `try/except` que os alunos já conhecem; os códigos continuam explícitos.

## 2026-10-14 — D04: Letra com acento é a mesma letra
**Decisão:** comparar sempre normalizado (NFD sem marcas, maiúsculas); mostrar o caractere original quando revelado.
**Justificativa:** regra R3; o jogador digita sem acento.

## 2026-10-14 — D05: O desenho é decidido por uma função pura
**Contexto:** o jsdom não implementa o canvas.
**Decisão:** `planoDeDesenho` devolve a lista de formas; `desenharForca` só traduz para chamadas ao contexto 2D.
**Justificativa:** a parte que decide o que aparece fica testável; sobra uma casca de ~15 linhas.

## 2026-10-14 — D06: Agente de código = Copilot (cloud agent); instruções em `.github/copilot-instructions.md`
**Contexto:** acesso gratuito via GitHub Education; a issue atribuída vira o prompt; o agente não pergunta no meio.
**Decisão:** uma única fonte de instruções, `.github/copilot-instructions.md`; issues autocontidas; dúvida vira PR rascunho com seção "Dúvidas".
**Justificativa:** agente autônomo precisa de pedido completo e de regra para quando não souber.

## 2026-10-14 — D07: O agente não escreve o gate, o STATUS nem o DECISIONS
**Decisão:** gate de compreensão, `STATUS.md` e `DECISIONS.md` são escritos pelo aluno; o agente sugere linhas na descrição do PR.
**Justificativa:** o gate só funciona com as palavras do aluno; evita conflitos de merge nos arquivos compartilhados.

## 2026-10-14 — D08: Repositório público e GitHub Pages
**Contexto:** Pages gratuito exige repositório público; o jogo não tem dado sensível.
**Decisão:** repositório público; publicação por workflow (`pages.yml`).
