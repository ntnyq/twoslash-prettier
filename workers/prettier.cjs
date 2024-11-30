const { runAsWorker } = require('synckit')

let prettier

runAsWorker(async function (source, options) {
  if (!prettier) {
    prettier = await import('prettier')
  }
  return prettier.format(source, options)
})
