const { runAsWorker } = require('synckit')

/**
 * @type {import('prettier')}
 */
let prettier

runAsWorker(
  async function (
    /**
     * @type {string}
     */
    source,

    /**
     * @type {import('prettier').Options}
     */
    options,
  ) {
    if (!prettier) {
      prettier = await import('prettier')
    }
    return prettier.format(source, options)
  },
)
