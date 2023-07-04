import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_CONFIG_NAME } from './constants'

export async function getSettings(options: any) {
  console.log('start get settings call', options)
  try {
    const workingDir = process.cwd()

    if (!fs.existsSync(workingDir) || !fs.lstatSync(workingDir).isDirectory()) {
      throw('ERROR: Path to your working directory could not be found.')
    }

    const configFileName = options.configFileName || DEFAULT_CONFIG_NAME
    const configFile = path.resolve(workingDir, configFileName)

    if (!fs.existsSync(configFile)) {
      throw(`ERROR: Config file ${configFileName} could not be found. Make sure that is exists.`)
    }

    const userConfigString = fs.readFileSync(configFile, 'utf-8')
    const userConfig = JSON.parse(userConfigString)

    return userConfig.sass.pfad
  } catch (e) {
    throw new Error(e)
  }
}
