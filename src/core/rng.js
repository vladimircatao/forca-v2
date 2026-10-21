/**
 * Cria um gerador de números pseudoaleatórios determinístico.
 * @param {number} semente
 * @returns {() => number}
 */
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

/**
 * Escolhe um item aleatório de uma lista.
 * @param {() => number} rng
 * @param {Array} lista
 * @returns {any}
 */
export function escolher(rng, lista) {
  if (lista.length === 0) {
    throw new RangeError('a lista está vazia')
  }

  return lista[Math.floor(rng() * lista.length)]
}
