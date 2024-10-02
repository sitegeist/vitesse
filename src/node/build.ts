import { build as viteBuild } from 'vite'
import buildConfig from './configs/build'
import buildSpritemap from './functions/spritemap'

export async function build(userSettings: any, options: any) {
  if (options.watch) {
    console.log('The watcher is on duty now')
  }
  try {
    if (userSettings.build && (!options.mode)) {
      ;(async () => {
        await viteBuild(buildConfig(userSettings, options))
      })()
    }

    if (userSettings.spritemap && (!options.mode || options.mode === 'spritemap')) { // remove last mode opt
      ;(async () => {
        await buildSpritemap(userSettings, options)
      })()
    }
  } catch (e) {
    throw new Error(e)
  }
}
