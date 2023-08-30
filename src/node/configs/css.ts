// this is only in a separate file EXPERIMENTALLY using tailwind
// either integrate into sass/style build (change sass to css build) or run programatically directly via postcss (https://github.com/tailwindlabs/tailwindcss/discussions/1442)

import path from 'node:path'
import { globSync } from 'glob'
// import postcss from 'rollup-plugin-postcss'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { createRequire } from 'module'; // feels like a bad way, no dynamic import or so possible?
const require = createRequire(import.meta.url); // feels like a bad way, no dynamic import or so possible?

const cssConfig = (userSettings: any, options: any) => {

  const inputFiles = globSync(userSettings.styles.inputFiles)

  const outputPath = userSettings.styles.outputPath || './Resources/Public/Css/'
  const outputDir = path.resolve(process.cwd(), outputPath) // defaults aus constants nehmen
  const extPath = userSettings.extensionPath ? path.resolve(userSettings.extensionPath, outputPath) : path.resolve('/typo3conf/ext/sitepackage/', outputPath) // default aus constants nehmen
  const fileFormat = userSettings.styles.outputFilePattern || '[name].min[extname]' // change to ||

  let postCssPlugins = [
    require('autoprefixer')()
  ]

  if (!userSettings.excludeTailwind) {
    const tailwindConfigPath = userSettings.styles.tailwindConfigFile ? path.resolve(process.cwd(), userSettings.styles.tailwindConfigFile) : path.resolve(process.cwd(), './tailwind.config.js')

    postCssPlugins = [
      require('tailwindcss')({ config: tailwindConfigPath }),
      ...postCssPlugins
    ]
  }

  // console.log('TAILWIND CONFIG FILE', tailwindConfigPath)
  // console.log('CURRENT ENVT', process.env)
  // console.log('newoutpath', extPath)

  // ToDo: mode for production and dev in watcher
  return {
    root: process.cwd(), // default?
    base: extPath,
    build: {
      manifest: true,
      watch: options.watch ? {} : null,
      rollupOptions: {
        input: inputFiles,
        output: {
          entryFileNames: "[name].min.js", // ?
          assetFileNames: fileFormat,
        },
      },
      outDir: outputDir,
      emptyOutDir: userSettings.emptyOutDir || false
    },
    css: {
      postcss: {
        plugins: postCssPlugins
      }
    },
    // css: {
    //   postcss: {
    //     plugins: [ // needs to be in the array form since vite is slicing it
    //       require('tailwindcss')({ config: tailwindConfigPath }),
    //       require('autoprefixer')()
    //     ]
    //   }
    // },
    // plugins: [
    //   postcss({
    //     plugins: [
    //       tailwindcss: {},
    //       autoprefixer: {}
    //     ]
    //   })
    // ]
  }
}

export default cssConfig
