import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, relative } from 'node:path'
import process from 'node:process'
import { join } from 'pathe'
import { globSync } from 'tinyglobby'
import { expect, it } from 'vitest'
import { resolve } from '../scripts/utils'
import { createTwoslasher } from '../src'
import type { TwoslashGenericResult } from 'twoslash-protocol'

const fixtures = globSync('*', {
  cwd: resolve('tests/fixtures'),
  onlyFiles: true,
  absolute: true,
})

const twoslash = createTwoslasher()

fixtures.forEach(path => {
  const expectThrows = path.includes('/throws/')
  const inExt = extname(path).slice(1)
  const outExt = expectThrows ? '.txt' : '.json'
  const outPath = path
    .replace('/fixtures/', '/results/')
    .replace(/\.[^/.]+$/, outExt)

  it(`${relative(process.cwd(), path)}`, async () => {
    let result: TwoslashGenericResult

    try {
      const code = await readFile(path, 'utf-8')

      result = twoslash(code.replace(/\r\n/g, '\n'), inExt)
    } catch (err: unknown) {
      if (expectThrows) {
        await expect((err as Error).message).toMatchFileSnapshot(outPath)
        return
      } else {
        throw err
      }
    }

    if (expectThrows) {
      throw new Error('Expected to throw')
    } else {
      await expect(JSON.stringify(result, null, 2)).toMatchFileSnapshot(outPath)
    }
  })
})

it('resolves prettier config file without losing explicit parser', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'twoslash-prettier-'))
  const configFile = join(cwd, '.prettierrc.json')

  try {
    await writeFile(
      configFile,
      JSON.stringify({
        singleQuote: true,
        semi: false,
      }),
      'utf-8',
    )

    const twoslash = createTwoslasher({
      prettierConfigFile: configFile,
    })
    const result = twoslash('const message = "hello";\n', 'ts')
    const errorTexts = result.nodes.flatMap(i => ('text' in i ? [i.text] : []))

    expect(result.nodes.length).toBeGreaterThan(0)
    expect(errorTexts.join('\n')).toContain('hello')
  } finally {
    await rm(cwd, {
      recursive: true,
      force: true,
    })
  }
})

it('resolves prettier config from cwd', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'twoslash-prettier-'))
  const configFile = join(cwd, '.prettierrc.json')

  try {
    await writeFile(
      configFile,
      JSON.stringify({
        singleQuote: true,
      }),
      'utf-8',
    )

    const twoslash = createTwoslasher({
      cwd,
    })
    const result = twoslash('const message = "hello"\n', 'ts')
    const errorTexts = result.nodes.flatMap(i => ('text' in i ? [i.text] : []))

    expect(result.nodes).toHaveLength(1)
    expect(errorTexts[0]).toContain('Replace')
  } finally {
    await rm(cwd, {
      recursive: true,
      force: true,
    })
  }
})
