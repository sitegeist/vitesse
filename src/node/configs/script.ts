import path from 'node:path'
import { globSync } from 'glob'
import react from '@vitejs/plugin-react'

const scriptConfig = (userSettings: any, options: any) => {
  // const inputFiles = Object.keys(userSettings.script.inputFiles).reduce(
  //   (attr, key) => ({
  //     ...attr,
  //     [key]: userSettings.script.inputFiles[key]
  //   }),
  //   {}
  // )

  const inputFiles = globSync(userSettings.script.inputFiles)

  // const inputFiles = [
  //   'Resources/Private/Components/Molecule/Another/Another.ts', 'Resources/Private/Components/Atom/Initial/Initial.ts',
  //   { Main: 'Resources/Private/JavaScript/Main.ts' }
  // ]

  // const inputFiles = [
  //   'Resources/Private/Components/Molecule/Another/Another.ts', 'Resources/Private/Components/Atom/Initial/Initial.ts', 'Resources/Private/JavaScript/Main.ts'
  // ]

  const outputDir = userSettings.script.outputPath ? path.resolve(process.cwd(), userSettings.script.outputPath) : path.resolve(process.cwd(), './Resources/Public/JavaScript/') // default aus constants nehmen
  const fileFormat = userSettings.script.outputFilePattern ? userSettings.script.outputFilePattern : '[name].min.js' // greift hier noch nicht

  return {
    root: process.cwd(), // default?
    base: '/',
    build: {
      manifest: true,
      watch: options.watch ? {} : null,
      rollupOptions: {
        input: inputFiles,
        output: {
          entryFileNames: fileFormat, // ?
          assetFileNames: '[name].min[extname]',
        },
        plugins: [ react() ],
        // plugins: [ multiInput() ],
      },
      outDir: outputDir,
      emptyOutDir: userSettings.emptyOutDir || false
    }
  }
}

export default scriptConfig
