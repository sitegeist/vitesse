import path from 'node:path'
import { globSync } from 'glob'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { sveltePreprocess } from 'svelte-preprocess'
import pc from 'picocolors'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import { createRequire } from 'module'
const require = createRequire(import.meta.url);

const buildConfig = (userSettings: any, options: any) => {
  if (!userSettings.build.inputFiles) {
    console.log(pc.red(`✖ The option ${pc.bold('inputFiles')} could not be found in your Vitesse config file. Aborting mission.`))
    process.exit(1)
  }

  const inputFiles = globSync(userSettings.build.inputFiles)

  const outputPath = userSettings.build.outputPath || './Resources/Public/Build/'
  const outputDir = path.resolve(process.cwd(), outputPath)
  const extPath = userSettings.extensionPath ? path.resolve(userSettings.extensionPath, outputPath) : path.resolve('/typo3conf/ext/sitepackage/', outputPath)
  const fileFormat = userSettings.build.outputFilePattern || '[name].min.js'

  let postCssPlugins = [
    require('autoprefixer')(),
    require('@tailwindcss/postcss')(),
  ]

  let vitePlugins = [
    sassGlobImports()
  ]

  const svelteConfigFile = userSettings.build.svelteConfigFile ? path.resolve(process.cwd(), userSettings.build.svelteConfigFile) : path.resolve(process.cwd(), './svelte.config.js')

  if (userSettings.includeSvelte) {
    vitePlugins = [
      ...vitePlugins,
      ...svelte({
        preprocess: sveltePreprocess(),
        configFile: svelteConfigFile
      })
    ]
  }

  return {
    root: process.cwd(),
    base: extPath,
    build: {
      modulePreload: userSettings.modulePreload === false ? false : { polyfill: true }, // option solely for TYPO3 >= 12 since the assets folder is dynamicall created. If could be passed here, preload could be used.
      manifest: true,
      watch: options.watch ? {} : null,
      rollupOptions: {
        input: inputFiles,
        output: {
          entryFileNames: `JavaScript/${fileFormat}`,
          chunkFileNames: 'JavaScript/Chunks/[name]-[hash].js',

          assetFileNames: (assetFile: any) => {
            const info = assetFile.name.split('.')
            const extType = info[info.length - 1]
            if (/\.(png|jpe?g|gif|svg|webp)$/.test(assetFile.name)) {
              return `Images/[name].${extType}`
            }
            if (/\.(webm|mp3|mp4)$/.test(assetFile.name)) {
              return `Media/[name].${extType}`
            }
            if (/\.(css)$/.test(assetFile.name)) {
              return `Css/[name].min.${extType}`
            }
            if (/\.(woff|woff2|eot|ttf|otf)$/.test(assetFile.name)) {
              return `Fonts/[name].${extType}`
            }
            return `Misc/[name].${extType}`
          },
        },
        plugins: [
          react()
        ]
      },
      outDir: outputDir,
      emptyOutDir: userSettings.emptyOutDir || false
    },
    plugins: vitePlugins,
    css: {
      postcss: {
        plugins: postCssPlugins
      }
    }
  }
}

export default buildConfig
