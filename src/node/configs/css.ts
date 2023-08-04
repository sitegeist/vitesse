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

  const inputFiles = globSync(userSettings.sass.inputFiles)

  const outputDir = userSettings.sass.outputPath ? path.resolve(process.cwd(), userSettings.sass.outputPath) : path.resolve(process.cwd(), './Resources/Public/Css/') // default aus constants nehmen
  const fileFormat = userSettings.sass.outputFilePattern ? userSettings.sass.outputFilePattern : '[name].min[extname]' // change to ||
  const tailwindConfigPath = userSettings.sass.tailwindConfigFile ? path.resolve(process.cwd(), userSettings.sass.tailwindConfigFile) : path.resolve(process.cwd(), './tailwind.config.js') // change to ||

  console.log('TAILWIND CONFIG FILE', tailwindConfigPath)

  return {
    root: process.cwd(), // default?
    base: '/',
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
        plugins: [
          require('tailwindcss')({ config: tailwindConfigPath }),
          require('autoprefixer')()
        ]
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
