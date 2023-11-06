import path from 'node:path'
import { globSync } from 'glob'
import react from '@vitejs/plugin-react'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import pc from 'picocolors'
import sassGlobImports from 'vite-plugin-sass-glob-import'
import { createRequire } from 'module' // good practice? no dynamic import or so possible?
const require = createRequire(import.meta.url); // good practice? no dynamic import or so possible?

const buildConfig = (userSettings: any, options: any) => {
  // console.log('BUILDCONFIG STARTED')

  if (!userSettings.build.inputFiles) {
    console.log(pc.red(`✖ The option ${pc.bold('inputFiles')} could not be found in your Vitesse config file. Aborting mission.`))
    process.exit(1)
  }

  const inputFiles = globSync(userSettings.build.inputFiles)

  const outputPath = userSettings.build.outputPath || './Resources/Public/Build/'
  const outputDir = path.resolve(process.cwd(), outputPath) // defaults aus constants nehmen
  const extPath = userSettings.extensionPath ? path.resolve(userSettings.extensionPath, outputPath) : path.resolve('/typo3conf/ext/sitepackage/', outputPath) // default aus constants nehmen
  const fileFormat = userSettings.build.outputFilePattern || '[name].min.js' // greift hier noch nicht?

  let postCssPlugins = [
    require('autoprefixer')()
  ]

  let vitePlugins = [
    sassGlobImports()
  ]

  if (!userSettings.excludeTailwind) { // really necessary option? Just don't need to include it if not needed…
    const tailwindConfigPath = userSettings.build.tailwindConfigFile ? path.resolve(process.cwd(), userSettings.build.tailwindConfigFile) : path.resolve(process.cwd(), './tailwind.config.js')

    postCssPlugins = [
      require('tailwindcss')({ config: tailwindConfigPath }),
      ...postCssPlugins
    ]
  }

  const svelteConfigFile = userSettings.build.svelteConfigFile ? path.resolve(process.cwd(), userSettings.build.svelteConfigFile) : path.resolve(process.cwd(), './svelte.config.js')

  if (userSettings.includeSvelte) {
    vitePlugins = [
      ...vitePlugins,
      svelte({
        preprocess: sveltePreprocess(),
        configFile: svelteConfigFile
      })
    ]
  }

  // console.log('TAILWIND CONFIG FILE', tailwindConfigPath)
  // console.log('CURRENT ENVT', process.env)
  // console.log('newextPath', extPath)
  // console.log('newoutpath', outputDir)

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
        ],
        // external: [
        //   /^svelte\/.*/,
        // ]
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
