import path from 'node:path'
import sassGlobImports from 'vite-plugin-sass-glob-import'

const sassConfig = (userSettings: any, options: any) => {
  // change this pattern to take a simple array as the typescript config?
  const inputFiles = Object.keys(userSettings.sass.inputFiles).reduce(
    (attr, key) => ({
      ...attr,
      [key]: userSettings.sass.inputFiles[key]
    }),
    {}
  )

  console.log(inputFiles)

  const outputDir = userSettings.sass.outputPath ? path.resolve(process.cwd(), userSettings.sass.outputPath) : path.resolve(process.cwd(), './Resources/Public/Css/') // default aus constants nehmen
  const fileFormat = userSettings.sass.outputFilePattern ? userSettings.sass.outputFilePattern : '[name].min[extname]'

  return {
    root: process.cwd(), // default?
    base: '/',
    build: {
      manifest: true,
      watch: options.watch ? {} : null,
      rollupOptions: {
        input: inputFiles,
        output: {
          entryFileNames: "[name].js", // ?
          assetFileNames: fileFormat,
        },
      },
      outDir: outputDir
    },
    plugins: [
      sassGlobImports()
    ]
  }
}

export default sassConfig
