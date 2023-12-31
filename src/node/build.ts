import { build as viteBuild } from 'vite'
// import path from 'node:path'
// import sassConfig from './configs/sass'
import buildConfig from './configs/build'
// import cssConfig from './configs/css'
// import scriptConfig from './configs/script'
import buildSpritemap from './functions/spritemap'

export async function build(userSettings: any, options: any) {
  // console.log('build function fire')
  if (options.watch) {
    console.log('The watcher is on duty now')
  }
  try {
    // const workingDir = process.cwd()
    // console.log(options)
    // const { getSettings } = await import('./utils')
    // console.log('config:', await getSettings(options))
    // const userSettings = await getSettings(options.configFileName) // userSettings früher laden und übergeben?

    // console.log('outDir', path.resolve(process.cwd(), userSettings.styles.outputPath))

    // console.log(userSettings)
    // if (userSettings.styles && (!options.mode || options.mode === 'sass')) {
    //   ;(async () => {
    //     await viteBuild(sassConfig(userSettings, options))
    //   })()
    // }

    if (userSettings.build && (!options.mode)) {
      ;(async () => {
        await viteBuild(buildConfig(userSettings, options))
      })()
    }

    // if (userSettings.styles && (!options.mode || options.mode === 'sass')) {
    //   ;(async () => {
    //     await viteBuild(cssConfig(userSettings, options))
    //   })()
    // }

    // if (userSettings.script && (!options.mode || options.mode === 'script')) {
    //   ;(async () => {
    //     await viteBuild(scriptConfig(userSettings, options))
    //   })()
    // }

    if (userSettings.spritemap && (!options.mode || options.mode === 'spritemap')) { // remove last mode opt
      ;(async () => {
        await buildSpritemap(userSettings, options)
      })()
    }
  } catch (e) {
    throw new Error(e)
  }
}
