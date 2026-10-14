#!/usr/bin/env node
/**
 * Cria as issues descritas em docs/issues/*.md usando a GitHub CLI (`gh`).
 *
 * Uso:
 *   node scripts/criar-issues.mjs --dry-run     valida os arquivos, não cria nada
 *   node scripts/criar-issues.mjs --show 7      mostra como ficaria a issue #7
 *   node scripts/criar-issues.mjs               cria labels e issues no repositório atual
 *   node scripts/criar-issues.mjs --from 9      retoma a criação a partir da issue 9
 *
 * Para criar de verdade: `gh auth status` ok (nos Codespaces já vem autenticado) e o
 * repositório SEM nenhuma issue ou PR (os números precisam coincidir com os do arquivo,
 * porque as dependências usam "#N").
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const PASTA = 'docs/issues'
const ESPERA_MS = 1500

const LABELS = {
  epico: ['5319e7', 'Issue-mãe que agrupa as demais'],
  core: ['1d76db', 'Regras do jogo (src/core)'],
  dados: ['0e8a16', 'Palavras, normalização, sorteio e salvamento'],
  visao: ['5ebeff', 'Visão do jogador, textos e desenho'],
  ui: ['c2e0c6', 'Página e tela (src/ui)'],
  canvas: ['fef2c0', 'Desenho no canvas'],
  app: ['fbca04', 'Ligação com o navegador (src/app)'],
  qualidade: ['f9d0c4', 'Testes e qualidade'],
  docs: ['cfd3d7', 'Documentação e publicação'],
  manual: ['e99695', 'Passo manual'],
}

const RODAPE = `
---
## Como executar esta issue
1. **Aluno:** antes de tudo, comente aqui, com suas palavras, **o que você espera que aconteça** e **um caso de teste extra que você inventou**. Só depois atribua a issue ao Copilot.
2. Atribua a issue ao **Copilot** (Assignees). Ele abre um PR; acompanhe a sessão.
3. **Revise o PR linha por linha.** Se algo não faz sentido, pergunte ao Copilot no próprio PR (por exemplo: "explique a linha X") antes de aprovar.
4. Preencha o **gate de compreensão** do PR com as suas palavras. O Copilot não preenche.
5. Merge (squash, título do PR como mensagem) só com o CI verde e a revisão de um colega.

## Definição de pronto
- [ ] Comentei na issue o que eu esperava, ANTES de atribuir ao Copilot
- [ ] O PR tem \`Closes #{n}\`, título de uma linha e sem " e "
- [ ] \`npm run check\` verde no CI
- [ ] Li o código inteiro do PR; gate de compreensão preenchido por mim
- [ ] STATUS.md / DECISIONS.md atualizados por mim se houve armadilha nova ou decisão
- [ ] Revisão de um colega e merge (squash)

## Instruções para o agente
Siga \`.github/copilot-instructions.md\`. Esta issue é o seu pedido completo: faça somente o que ela pede, nos arquivos que ela lista, e use os valores do "Comportamento esperado" literalmente nos testes. Se algo estiver ambíguo, abra o PR como rascunho com a seção "Dúvidas" em vez de adivinhar.
`

const falhar = (mensagem) => {
  console.error(`\nERRO: ${mensagem}`)
  process.exit(1)
}

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf8' }).trim()
const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function lerIssues() {
  const arquivos = readdirSync(PASTA)
    .filter((a) => a.endsWith('.md'))
    .sort()
  if (arquivos.length === 0) falhar(`nenhum arquivo .md em ${PASTA}`)
  const texto = arquivos.map((a) => readFileSync(join(PASTA, a), 'utf8')).join('\n')
  const partes = texto.split(/^### #(\d+) — (.+)$/m)
  const issues = []
  for (let i = 1; i < partes.length; i += 3) {
    const corpo = partes[i + 2].trim()
    const campo = (nome) => corpo.match(new RegExp(`^\\*\\*${nome}:\\*\\*\\s*(.+)$`, 'm'))?.[1]
    const labels = (campo('Labels') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    issues.push({
      numero: Number(partes[i]),
      titulo: partes[i + 1].trim(),
      corpo,
      labels,
      pai: Number(campo('Pai')?.match(/#(\d+)/)?.[1]) || null,
      deps: [...(campo('Depende de')?.matchAll(/#(\d+)/g) ?? [])].map((m) => Number(m[1])),
      commit: corpo.match(/^\*\*Commit esperado:\*\*\s*`(.+)`/m)?.[1] ?? null,
      epico: labels.includes('epico'),
    })
  }
  return issues
}

function validar(issues) {
  const erros = []
  const porNumero = new Map(issues.map((i) => [i.numero, i]))
  issues.forEach((issue, indice) => {
    const n = issue.numero
    if (n !== indice + 1) erros.push(`#${n}: numeração fora de sequência (esperado #${indice + 1})`)
    if (issue.labels.length === 0) erros.push(`#${n}: sem **Labels:**`)
    for (const l of issue.labels) if (!(l in LABELS)) erros.push(`#${n}: label desconhecida '${l}'`)
    if (issue.epico) return
    if (!porNumero.get(issue.pai)?.epico) erros.push(`#${n}: **Pai:** inválido ou não é épico`)
    if (!issue.commit) erros.push(`#${n}: sem **Commit esperado:**`)
    else if (/\s(e|and)\s/i.test(issue.commit)) {
      erros.push(`#${n}: a mensagem de commit tem 'e'/'and': divida a issue`)
    }
    for (const d of issue.deps) if (d >= n) erros.push(`#${n}: depende de #${d}, que não vem antes`)
    for (const secao of ['**Comportamento esperado', '**Fora do escopo', '**Arquivos']) {
      if (!issue.corpo.includes(secao)) erros.push(`#${n}: falta a seção ${secao}:**`)
    }
  })
  return erros
}

function corpoFinal(issue, issues) {
  if (!issue.epico) return `${issue.corpo}\n${RODAPE.replaceAll('{n}', String(issue.numero))}`
  const filhas = issues.filter((i) => i.pai === issue.numero)
  const lista = filhas.map((f) => `- [ ] #${f.numero}`).join('\n')
  return `${issue.corpo}\n\n## Issues filhas\n${lista}\n`
}

async function main() {
  const args = process.argv.slice(2)
  const valor = (flag) => args[args.indexOf(flag) + 1]
  const aPartirDe = args.includes('--from') ? Number(valor('--from')) : 1
  const issues = lerIssues()
  const erros = validar(issues)
  if (erros.length > 0) falhar(`validação falhou:\n- ${erros.join('\n- ')}`)
  const epicos = issues.filter((i) => i.epico).length
  console.log(
    `Validação ok: ${issues.length} issues (${epicos} épico, ${issues.length - epicos} tarefas).`,
  )

  if (args.includes('--show')) {
    const issue = issues.find((i) => i.numero === Number(valor('--show')))
    if (!issue) falhar(`não existe a issue #${valor('--show')}`)
    console.log(`TÍTULO: ${issue.titulo}\nLABELS: ${issue.labels.join(', ')}\n`)
    console.log(corpoFinal(issue, issues))
    return
  }
  if (args.includes('--dry-run')) {
    console.log('Modo --dry-run: nada foi criado.')
    return
  }

  try {
    gh('auth', 'status')
  } catch {
    falhar('`gh` não está instalado ou não está autenticado. Rode `gh auth login`.')
  }
  console.log(
    `Repositório: ${gh('repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner')}`,
  )

  if (aPartirDe === 1) {
    const jaTem = (cmd) =>
      JSON.parse(gh(cmd, 'list', '--state', 'all', '--limit', '1', '--json', 'number')).length > 0
    if (jaTem('issue') || jaTem('pr')) {
      falhar(
        'o repositório já tem issues ou PRs; os números não vão coincidir. Use um repositório novo ou --from N.',
      )
    }
    console.log('Criando labels...')
    for (const [nome, [cor, descricao]] of Object.entries(LABELS)) {
      gh('label', 'create', nome, '--color', cor, '--description', descricao, '--force')
    }
  }

  const pasta = mkdtempSync(join(tmpdir(), 'issues-'))
  for (const issue of issues.filter((i) => i.numero >= aPartirDe)) {
    const arquivo = join(pasta, `${issue.numero}.md`)
    writeFileSync(arquivo, corpoFinal(issue, issues))
    const saida = gh(
      'issue',
      'create',
      '--title',
      issue.titulo,
      '--body-file',
      arquivo,
      '--label',
      issue.labels.join(','),
    )
    const criada = Number(saida.match(/\/issues\/(\d+)\s*$/)?.[1] ?? -1)
    if (criada !== issue.numero) {
      falhar(
        `a issue '${issue.titulo}' virou #${criada}, mas o arquivo diz #${issue.numero}. Pare e investigue (depois use --from ${issue.numero + 1}).`,
      )
    }
    console.log(`  criada #${criada}: ${issue.titulo}`)
    await dormir(ESPERA_MS)
  }
  console.log('\nConcluído.')
}

main()
