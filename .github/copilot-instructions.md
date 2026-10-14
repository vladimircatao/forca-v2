# Instruções para o agente — Jogo da Forca (JavaScript + canvas)

Você é um agente que trabalha **sozinho**, sem poder perguntar nada no meio da execução. A **issue atribuída é o seu pedido completo**. O aluno que a atribuiu já confirmou, em um comentário, o que espera dela. Seu trabalho: entregar um PR pequeno, correto e fácil de revisar.

## Projeto

Jogo da forca no navegador: regras puras em `src/core/`, DOM/canvas em `src/ui/`, ligação em `src/app/`. É o projeto-piloto de uma disciplina de programação para iniciantes, construído com issues pequenas. **Quem aprende é o aluno**: o código precisa ser simples e legível por quem sabe Python básico.

## Antes de escrever código

1. Leia a issue inteira, o épico-pai (#1) e as issues em "Depende de".
2. Leia `docs/ESPECIFICACAO.md` e `docs/ARQUITETURA.md` (só as seções citadas), além de `STATUS.md` (armadilhas) e `DECISIONS.md` (decisões já tomadas).
3. Leia os comentários da issue: o aluno pode ter restringido ou esclarecido o pedido.

## Se algo estiver ambíguo, contraditório ou impossível

**Não adivinhe e não invente regra.** Faça assim:

1. Implemente apenas a parte sem ambiguidade (se houver).
2. Abra o PR como **rascunho** (draft).
3. Na descrição, crie a seção **"Dúvidas"** com perguntas numeradas, fechadas (sim/não ou A/B) e dizendo o que você assumiu provisoriamente.

## Escopo

- Faça **somente** o que a issue pede. Respeite "Fora do escopo".
- Toque **somente** nos arquivos listados em **Arquivos** da issue. Se achar que precisa de outro, pare e registre em "Dúvidas".
- Não adicione dependência, script do `package.json`, workflow, configuração de lint/prettier nem arquivo extra.
- Não altere `STATUS.md` nem `DECISIONS.md`: quem escreve a memória do projeto é o aluno. Se aprendeu uma armadilha ou tomou uma decisão, escreva na descrição do PR, na seção **"Sugestão para STATUS/DECISIONS"**.
- Nunca refatore código de outras issues "de passagem".

## Regras de arquitetura (o ESLint barra várias delas)

- `src/core/` é puro: sem `document`, `window`, `localStorage`, `Date` nem `Math.random`. O sorteio recebe `rng`.
- Estado **imutável**: funções devolvem um NOVO objeto congelado (`Object.freeze`); nunca alteram o recebido.
- Jogada recusada = `throw new JogadaInvalida(codigo)`. `RangeError` apenas para dado impossível (erro de programação).
- A interface recebe a `Visao`, **nunca** o `Estado` (que tem a palavra secreta).
- Nenhuma regra do jogo em `src/ui/` ou `src/app/`.
- Módulos ES (`import`/`export` nomeados, com extensão `.js`). Sem `default export`, sem classes além de `JogadaInvalida`.

## Testes

- Use `node:test` e `node:assert/strict`. Um arquivo `tests/<pasta>/<modulo>.test.js` por módulo.
- Nomes dos testes em português, descrevendo o comportamento (`test('letra repetida não penaliza', ...)`).
- **Cada item de "Comportamento esperado" da issue vira um teste**, com os valores literais da issue. Os valores esperados foram escolhidos por humanos: **não os ajuste para o seu código passar**. Se um valor da issue parecer errado, não o mude: registre em "Dúvidas".
- Pode propor casos extras, mas liste-os separadamente no PR como "Casos extras (não validados por humano)".
- Escreva o teste antes ou junto da implementação, e confira que ele falha sem ela.

## Estilo

- Identificadores em português **sem acento** (`novoJogo`, `mascara`, `letraRepetida`). Textos da tela, comentários, mensagens de commit e PR em português do Brasil (pt-BR).
- Funções pequenas, nomes que dispensam comentário. Comentários explicam o *porquê*, nunca repetem o código.
- JSDoc nas funções públicas (parâmetros e retorno).
- Sem esperteza: prefira um `for` e `if` claros a uma cadeia de `reduce` difícil de ler.

## Validação antes de terminar

1. Rode `npm ci` (se necessário) e depois **`npm run check`** (ESLint + Prettier + testes). Só entregue com tudo verde.
2. Se `npm run format:check` falhar, rode `npm run format` e confira que só mexeu nos seus arquivos.
3. Para mudanças de tela, abra `npm run dev` (http://localhost:8000) e confira o resultado quando a issue tratar de aparência.

## Commit e PR

- **Um PR por issue.** Título do PR = mensagem do commit: **uma linha, em português, sem " e "**, com prefixo (`feat(core):`, `feat(ui):`, `test:`, `docs:`, `ci:`). Use exatamente o "Commit esperado" da issue.
- Descrição do PR começa com `Closes #N`.
- Preencha no PR: **O que mudou** (2 a 4 linhas), **Como verifiquei** (saída resumida do `npm run check`), e, se houver, **Dúvidas** e **Sugestão para STATUS/DECISIONS**.
- **Não preencha o "Gate de compreensão"** do template: é do aluno, com as palavras dele. Deixe os campos em branco.
- Não faça merge, não force push, não edite a branch `main`.
- Se o aluno pedir ajustes por comentário no PR, faça-os no mesmo PR, sem ampliar o escopo.

## Comandos

`npm run dev` (servidor local) · `npm test` · `npm run lint` · `npm run format` · `npm run check` (tudo o que o CI roda)
