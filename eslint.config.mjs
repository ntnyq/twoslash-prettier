// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  ignores: ['**/tests/results/**', 'docs/index.md'],
  oxfmt: true,
  prettier: false,
  test: {
    vitest: {
      overrides: {
        'vitest/no-conditional-expect': 'off',
      },
    },
  },
})
