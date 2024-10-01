import { cac } from 'cac'

const { getSettings } = await import('./utils')

const cli = cac('vitesse')

cli
  .command('[root]', 'Running vitesse default command')
  .alias('build')
  .option('--mode [mode]', '[string] e.g. sass, js')
  .option('--watch', '[boolean] watch mode')
  .option('--config [configFileName]', '[string] alternative name of the config file')
  .action(async (root, options) => {
    const { build } = await import('./build')

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
    }
  })

cli.parse()

