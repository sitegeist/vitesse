import { build as viteBuild } from 'vite'
// import path from 'node:path'
import sassConfig from './viteConfigs/sass'
import scriptConfig from './viteConfigs/script'
import buildSpritemap from './functions/spritemap'

export async function build(userSettings: any, options: any) {
  console.log('build function fire')
  try {
    // const workingDir = process.cwd()
    // console.log(options)
    // const { getSettings } = await import('./utils')
    // console.log('config:', await getSettings(options))
    // const userSettings = await getSettings(options.configFileName) // userSettings früher laden und übergeben?

    // console.log('outDir', path.resolve(process.cwd(), userSettings.sass.outputPath))

    // console.log(userSettings)
    if (userSettings.sass && (!options.mode || options.mode === 'sass')) {
      ;(async () => {
        await viteBuild(sassConfig(userSettings, options))
      })()
    }

    if (userSettings.script && (!options.mode || options.mode === 'script')) {
      ;(async () => {
        await viteBuild(scriptConfig(userSettings, options))
      })()
    }

    if (userSettings.spritemap && (!options.mode || options.mode === 'spritemap')) {
      ;(async () => {
        await buildSpritemap(userSettings, options)
      })()
    }

    return console.log('we did the build (not yet)')
  } catch (e) {
    throw new Error(e)
  }
}
