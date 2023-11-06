import path from 'node:path'
import lintConfig from './configs/eslint'
import { fileURLToPath } from 'node:url'
// import { standard } from 'ts-standard'
// import standard from 'standard'
import { ESLint } from 'eslint'

export async function lint(userSettings: any, options: any) {
  console.log('TRY LINT')
  try {

      // ;(async () => {
      //   await standard.lintFiles(userSettings.build.inputFiles)
      // })()
    const userConfig = path.resolve(process.cwd(), 'configFileName')

    const __filename = fileURLToPath(import.meta.url)

    const __dirname = path.dirname(__filename)

    const configFile = userSettings.build.tailwindConfigFile ? path.resolve(process.cwd(), userSettings.lint.configFile) : path.resolve(process.cwd(), './.eslintrc.json')

    const defaultConfig = path.resolve(__dirname, 'src/node/configs/.eslintrc.cjs')

    console.log('defcon', defaultConfig)

    // copied tsconfig and base.tsconfig in rollup plugin. probably can't read linked types anyway? also:
    // says it doesn't find the files, even if added manually under "files" in eslint.ts
    // eslint config file probably needs to be outsourced into project -> also doesn't work, still needs tsconfig (in vitesse)
    const options = {
      overrideConfigFile: configFile
    }

    console.log('START LINT PROCESS')
    // 1. Create an instance.
    const eslint = new ESLint(options);

    // 2. Lint files.
    const results = await eslint.lintFiles(userSettings.build.inputFiles);

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    // 4. Output it.
    console.log(resultText);

  } catch (e) {
    throw new Error(e)
  }
}
