---
outline: false
aside: false
---

## Install

::: code-group

```shell [npm]
npm i twoslash-prettier -D
```

```shell [yarn]
yarn add twoslash-prettier -D
```

```shell [pnpm]
pnpm add twoslash-prettier -D
```

:::

## Usage

```ts [config.ts] twoslash
import { createTwoslasher } from 'twoslash-prettier'

const code = `
console.log('Code to check')
`

const twoslasher = createTwoslasher({
  prettierConfig: {
    semi: true,
  },
})

const result = twoslasher(code, 'index.ts')
```

## Usage with Shiki

If you are using [@shikijs/twoslash](https://shiki.style/packages/twoslash) and want to support both TypeScript Twoslash and Prettier TwoSlash, you can use the following code:

```ts [config.ts] twoslash
// @noErrors
import Shiki from '@shikijs/markdown-it'
import { transformerTwoslash } from '@shikijs/twoslash'
import { createTwoslasher as createTwoslasherPrettier } from 'twoslash-prettier'

const shikiPlugin = await Shiki({
  theme: 'vitesse-light',
  // Or any other integrations that support passing Shiki transformers
  transformers: [
    // This is for normal TypeScript Twoslash
    transformerTwoslash({
      explicitTrigger: /\btwoslash\b/,
    }),
    // Create another transformer, but with different trigger and Prettier twoslasher
    transformerTwoslash({
      // Enable languages that you want to support
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
        'md',
        'angular',
      ],
      explicitTrigger: /\bprettier-check\b/,
      // Pass the custom twoslasher
      twoslasher: createTwoslasherPrettier({
        prettierConfig: {
          semi: true,
        },
      }),
      // Use hover to render errors instead of inserting a error line
      // Up to your preference
      errorRendering: 'hover',
    }),
  ],
})
```

And then you can have the following code in your markdown:

````md
```ts twoslash
console.log('normal typescript twoslash')
```

```ts prettier-check
console.log('normal prettier twoslash')
```
````

## Release Notes

See [Release Notes](https://github.com/ntnyq/twoslash-prettier/releases).

## License

[MIT](https://github.com/ntnyq/twoslash-prettier/blob/main/LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
