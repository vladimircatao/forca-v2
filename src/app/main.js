import { iniciarApp } from './app.js'
import { criarRng } from '../core/rng.js'

let armazenamento

try {
  armazenamento = window.localStorage
} catch {
  armazenamento = null
}

iniciarApp({
  doc: document,
  ctx: document.getElementById('desenho').getContext('2d'),
  rng: criarRng(Date.now()),
  armazenamento,
})
