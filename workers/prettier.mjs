// @ts-check

import { runAsWorker } from 'synckit'

/**
 * @type {typeof import('prettier')}
 */
let prettier

runAsWorker(
  async (
    /**
     * @type {string}
     */
    source,

    /**
     * @type {import('prettier').Options & {config?: string | URL, cwd?: string}}
     */
    options = {},
  ) => {
    if (!prettier) {
      prettier = await import('prettier')
    }
    /**
     * @type {import('prettier').Options}
     */
    let resolvedOptions = {}

    if (options.config || options.cwd) {
      const resolveFrom = options.filepath ?? options.cwd ?? options.config

      if (resolveFrom) {
        const config = await prettier.resolveConfig(resolveFrom, {
          config: options.config,
        })

        if (config) {
          resolvedOptions = config
        }
      }
    }

    const { config: _config, cwd: _cwd, ...runtimeOptions } = options
    return prettier.format(source, {
      ...resolvedOptions,
      ...runtimeOptions,
    })
  },
)
