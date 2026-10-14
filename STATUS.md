# STATUS — Jogo da Forca (JavaScript)

Reescrito a cada checkpoint, por um humano. Sem lista de tarefas (elas vivem nas issues).

## O que funciona agora

Nada implementado: só o esqueleto (CI, configuração de ESLint e Prettier, devcontainer, instruções do Copilot) e as issues.

## Armadilhas conhecidas

Descobertas ao validar o kit com uma implementação de referência (92 testes + execução em Chromium):

- No jsdom, arrays e objetos devolvidos por código que roda dentro da janela (como `axe.run`) são de outro "mundo": `assert.deepEqual` estrito reclama mesmo com conteúdo igual. Converta com `Array.from(...)` (issue #37).
- O jsdom não implementa o canvas (`getContext` devolve `null`): teste o desenho com um contexto falso (issue #30) e deixe o resto para o plano puro (issue #20).
- `'ß'.toUpperCase()` é `'SS'`: por isso `normalizarLetra('ß')` é recusada (issue #4).
- `ev.key` de teclas como Enter é uma palavra (`'Enter'`): depois de normalizada vira `'ENTER'`, que não casa com `/^[A-Z]$/` e é ignorada (issue #34).
- Máscara de 10 letras tem 19 caracteres: sem `font-size` fluido, quebra de linha em telas de 360 px (issue #25).
- `eslint .` também analisa `scripts/*.mjs`: precisam dos globais do Node na configuração.
- Prettier ignora `docs/` e `*.md` de propósito, para não reformatar a documentação.

Previstas, ainda não vividas:

- Conflito de merge em `src/core/index.js`, `STATUS.md` e `DECISIONS.md` quando duas pessoas mexem neles.
- O Copilot pode propor testes com valores diferentes dos da issue; a regra é: valor da issue vence (ver `.github/copilot-instructions.md`).
- Workflows disparados por PRs do agente podem exigir aprovação manual para rodar. **Não verificado.**
- Créditos/limites de uso do Copilot para a turma. **Não verificado.**
