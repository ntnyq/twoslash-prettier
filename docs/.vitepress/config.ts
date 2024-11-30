import { transformerRenderWhitespace } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createTwoslasher } from 'twoslash-prettier'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { head } from './config/head'
import { getThemeConfig } from './config/theme'
import { appDescription, appTitle } from './meta'

export default defineConfig({
  title: appTitle,
  description: appDescription,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  head,
  themeConfig: getThemeConfig(),
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },

    codeTransformers: [
      transformerRenderWhitespace({
        position: 'all',
      }),
      transformerTwoslash({
        langs: [
          'js',
          'jsx',
          'cjs',
          'mjs',
          'ts',
          'tsx',
          'cts',
          'mts',
          'css',
          'scss',
          'less',
          'vue',
          'yml',
          'yaml',
          'json',
          'html',
          'md',
          'angular',
        ],
        errorRendering: 'hover',
        explicitTrigger: /\bprettier-check\b/,
        twoslasher: createTwoslasher({
          prettierConfig: {
            semi: false,
            singleQuote: true,
            tabWidth: 2,
            useTabs: false,
            quoteProps: 'as-needed',
            proseWrap: 'never',
            printWidth: 80,
            bracketSameLine: true,
            arrowParens: 'avoid',
            bracketSpacing: true,
            endOfLine: 'lf',
            trailingComma: 'none',
            experimentalTernaries: true,
          },
          prettierCodeProcess(code) {
            // Remove trailing newline and presentational `⏎` characters
            return code.replace(/⏎(?=\n)/gu, '').replace(/⏎$/gu, '\n')
          },
        }),
      }),
      transformerTwoslash({
        explicitTrigger: /\btwoslash\b/,
      }),
    ],
  },
})
