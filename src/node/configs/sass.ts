import path from 'node:path'
import { globSync } from 'glob'
import sassGlobImports from 'vite-plugin-sass-glob-import'

const sassConfig = (userSettings: any, options: any) => {
  // const inputFiles = Object.keys(userSettings.styles.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: userSettings.styles.inputFiles[key]
  //   }),
  //   {}
  // )

  const inputFiles = globSync(userSettings.styles.inputFiles)

  const outputDir = userSettings.styles.outputPath ? path.resolve(process.cwd(), userSettings.styles.outputPath) : path.resolve(process.cwd(), './Resources/Public/Css/') // default aus constants nehmen
  const fileFormat = userSettings.styles.outputFilePattern ? userSettings.styles.outputFilePattern : '[name].min[extname]'

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
    plugins: [
      sassGlobImports()
    ]
  }
}

export default sassConfig
