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
     * @type {import('prettier').Options & {config?: string | URL}}
     */
    options = {},
  ) => {
    if (!prettier) {
      prettier = await import('prettier')
    }

    if (options.config) {
      const configFile = await prettier.resolveConfigFile(options.config)

      if (configFile) {
        const resolvedOptions = await prettier.resolveConfig(configFile)

        if (resolvedOptions) {
          options = resolvedOptions
        }
      }
    }

    return prettier.format(source, options)
  },
)
