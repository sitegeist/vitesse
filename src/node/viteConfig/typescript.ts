import path from 'node:path'
import { globSync } from 'glob'
import multiInput from 'rollup-plugin-multi-input'

const typescriptConfig = (userSettings: any, options: any) => {
  // const inputFiles = Object.keys(userSettings.typescript.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: userSettings.typescript.inputFiles[key]
  //   }),
  //   {}
  // )

  const inputFiles = globSync(userSettings.typescript.inputFiles)

  // const inputFiles = [
  //   'Resources/Private/Components/Molecule/Another/Another.ts', 'Resources/Private/Components/Atom/Initial/Initial.ts',
  //   { Main: 'Resources/Private/JavaScript/Main.ts' }
  // ]

  // const inputFiles = [
  //   'Resources/Private/Components/Molecule/Another/Another.ts', 'Resources/Private/Components/Atom/Initial/Initial.ts', 'Resources/Private/JavaScript/Main.ts'
  // ]

  console.log(inputFiles)

  const outputDir = userSettings.typescript.outputPath ? path.resolve(process.cwd(), userSettings.typescript.outputPath) : path.resolve(process.cwd(), './Resources/Public/JavaScript/') // default aus constants nehmen
  const fileFormat = userSettings.typescript.outputFilePattern ? userSettings.typescript.outputFilePattern : '[name].min[extname]'

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
        // plugins: [ multiInput() ],
      },
      outDir: outputDir
    }
  }
}

export default typescriptConfig
