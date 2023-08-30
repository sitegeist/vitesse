import path from 'node:path'
import { globSync } from 'glob'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module' // feels like a bad way, no dynamic import or so possible?
const require = createRequire(import.meta.url); // feels like a bad way, no dynamic import or so possible?

const buildConfig = (userSettings: any, options: any) => {

  const inputFiles = globSync(userSettings.build.inputFiles)

  const outputPath = userSettings.build.outputPath || './Resources/Public/Build/'
  const outputDir = path.resolve(process.cwd(), outputPath) // defaults aus constants nehmen
  const extPath = userSettings.extensionPath ? path.resolve(userSettings.extensionPath, outputPath) : path.resolve('/typo3conf/ext/sitepackage/', outputPath) // default aus constants nehmen
  const fileFormat = userSettings.build.outputFilePattern || '[name].min.js' // greift hier noch nicht?

  let postCssPlugins = [
    require('autoprefixer')()
  ]

  if (!userSettings.excludeTailwind) { // really necessary option? Just don't need to include it if not needed…
    const tailwindConfigPath = userSettings.build.tailwindConfigFile ? path.resolve(process.cwd(), userSettings.build.tailwindConfigFile) : path.resolve(process.cwd(), './tailwind.config.js')

    postCssPlugins = [
      require('tailwindcss')({ config: tailwindConfigPath }),
      ...postCssPlugins
    ]
  }

  // console.log('TAILWIND CONFIG FILE', tailwindConfigPath)
  // console.log('CURRENT ENVT', process.env)
  console.log('newextPath', extPath)
  console.log('newoutpath', outputDir)

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
        plugins: [ react() ]
      },
      outDir: outputDir,
      emptyOutDir: userSettings.emptyOutDir || false
    },
    css: {
      postcss: {
        plugins: postCssPlugins
      }
    }
  }
}

export default buildConfig
