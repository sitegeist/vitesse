// import path from 'node:path'
// import fs from 'node:fs'
import { cac } from 'cac'

const { getSettings } = await import('./utils')

const cli = cac('vitesse')

// console.log('ClI ts loaded')

cli
  .command('[root]', 'Running vitesse default command') // default command
  .alias('build')
  .option('--mode [mode]', '[string] e.g. sass, js')
  .option('--watch', '[boolean] watch mode')
  .option('--config [configFileName]', '[string] alternative name of the config file')
  .action(async (root, options) => {
    // console.log('default commi')
    // console.log(options)
    const { build } = await import('./build')
    // const buildOptions = cleanOptions(options)

    try {
      await build(
        await getSettings(options.configFileName),
        {
          mode: options.mode,
          configFileName: options.config,
          watch: options.watch
        }
      )
    } catch (e) {
      process.exit(1)
      // throw e
    } finally {
      // console.log('Build finished (not yet)')
    }
  })

cli.parse()

// const workingDir = (process.argv[3]) ? path.resolve(process.argv[3]) : process.cwd()

