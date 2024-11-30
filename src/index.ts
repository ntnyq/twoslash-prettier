import { join } from 'node:path'
import { generateDifferences, showInvisibles } from 'prettier-linter-helpers'
import { createSyncFn } from 'synckit'
import { createPositionConverter, resolveNodePositions } from 'twoslash-protocol'
import { dirWorkers } from './dir'
import type { Config } from 'prettier'
import type {
  NodeErrorWithoutPosition,
  TwoslashGenericFunction,
  TwoslashGenericResult,
} from 'twoslash-protocol'

export interface CreateTwoslashPrettierOptions {
  /**
   * prettier config
   */
  prettierConfig?: Config

  /**
   * Map of file extensions to prettier parsers
   */
  prettierParserMap?: Record<string, string>

  /**
   * Default file extension
   *
   * @default `ts`
   */
  fallbackExtension?: string

  /**
   * Custom code transform before sending prettier to check
   */
  prettierCodeProcess?: (code: string) => string

  /**
   * The current working directory for prettier
   */
  cwd?: string

  /**
   * @default false
   */
  mergeMessages?: boolean
}

let format: (code: string, config: Config) => string

/**
 * File extension to prettier parser map
 */
const defaultParserMap = {
  js: 'babel',
  jsx: 'babel',
  cjs: 'babel',
  mjs: 'babel',

  ts: 'typescript',
  tsx: 'typescript',
  cts: 'typescript',
  mts: 'typescript',

  json: 'json',
  json5: 'json5',
  jsonc: 'jsonc',

  css: 'css',
  scss: 'scss',
  sass: 'scss',
  less: 'less',

  md: 'markdown',
  mdx: 'mdx',
  markdown: 'markdown',
  remark: 'remark',

  angular: 'angular',
  html: 'html',
  vue: 'vue',

  yaml: 'yaml',
  yml: 'yaml',
}

export function createTwoslasher(
  options: CreateTwoslashPrettierOptions = {},
): TwoslashGenericFunction {
  const { mergeMessages = false, fallbackExtension = 'ts' } = options
  const parserMap = {
    ...defaultParserMap,
    ...(options.prettierParserMap || {}),
  }

  if (!format) {
    format = createSyncFn(join(dirWorkers, 'prettier.cjs')) as any
  }

  return (code, file) => {
    const filename = file?.includes('.') ? file : `index.${file ?? fallbackExtension}`
    const ext = filename.split('.').pop() ?? fallbackExtension

    const formatedCode = format(options.prettierCodeProcess?.(code) || code, {
      ...(options.prettierConfig || {}),
      parser: parserMap[ext as keyof typeof parserMap],
    })
    const differences = generateDifferences(code, formatedCode)

    const pc = createPositionConverter(code)
    const raws: NodeErrorWithoutPosition[] = differences.map(
      (difference): NodeErrorWithoutPosition => {
        const { operation, offset, deleteText = '', insertText = '' } = difference

        let text = ''

        if (operation === 'insert') {
          text = `Insert \`${showInvisibles(insertText)}\``
        } else if (operation === 'delete') {
          text = `Delete \`${showInvisibles(deleteText)}\``
        } else if (operation === 'replace') {
          text = `Replace \`${showInvisibles(deleteText)}\` with \`${showInvisibles(insertText)}\``
        }

        return {
          type: 'error',
          id: `prettier/${operation}`,
          code: 0,
          text,
          start: offset,
          length: offset + deleteText.length,
          level: 'error',
          filename,
        }
      },
    )

    let merged: NodeErrorWithoutPosition[] = []

    if (mergeMessages) {
      for (const current of raws) {
        const existing = merged.find(r => r.start === current.start && r.length === current.length)
        if (existing) {
          existing.text += `\n${current.text}`
          continue
        }
        merged.push(current)
      }
    } else {
      merged = raws
    }

    const nodes = resolveNodePositions(merged, code)
      // filter out messages outside of the code
      .filter(i => i.line < pc.lines.length)

    const results: TwoslashGenericResult = {
      code,
      nodes,
    }

    return results
  }
}
