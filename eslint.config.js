import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['node_modules/**'] },
  js.configs.recommended,
  { files: ['src/**/*.js'], languageOptions: { globals: { ...globals.browser } } },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs', 'eslint.config.js'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // O núcleo é puro: nada de DOM, sorteio direto ou relógio.
    files: ['src/core/**/*.js'],
    rules: {
      'no-restricted-globals': ['error', 'document', 'window', 'localStorage', 'Date'],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Receba o gerador (rng) como argumento.' },
      ],
    },
  },
]
