import { readFile } from 'node:fs/promises'
import { extname, relative } from 'node:path'
import process from 'node:process'
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
    let result: TwoslashGenericResult = undefined!

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
