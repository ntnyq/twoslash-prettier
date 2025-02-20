/// <reference types="vite/client" />

import { extname } from 'node:path'
import { expect, it } from 'vitest'
import { createTwoslasher } from '../src'
import type { TwoslashGenericResult } from 'twoslash-protocol'

const fixtures = import.meta.glob<string>('./fixtures/**/*.*', {
  query: '?raw',
  import: 'default',
})

const twoslash = createTwoslasher()

Object.entries(fixtures).forEach(([path, fixture]) => {
  path = path.replace(/\\/g, '/')

  const expectThrows = path.includes('/throws/')
  const inExt = extname(path).slice(1)
  const outExt = expectThrows ? '.txt' : '.json'
  const outPath = path
    .replace('/fixtures/', '/results/')
    .replace(/\.[^/.]+$/, outExt)

  it(`${path}`, async () => {
    let result: TwoslashGenericResult = undefined!

    try {
      result = twoslash((await fixture()).replace(/\r\n/g, '\n'), inExt)
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
