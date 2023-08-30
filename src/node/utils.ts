import fs from 'node:fs'
import path from 'node:path'
import { DEFAULT_CONFIG_NAME } from './constants'

export async function getSettings(configFileSetting: any) {
  // console.log('start get settings call', configFileSetting)
  try {
    const workingDir = process.cwd()

    if (!fs.existsSync(workingDir) || !fs.lstatSync(workingDir).isDirectory()) {
      throw('ERROR: Path to your working directory could not be found.')
    }

    const configFileName = configFileSetting || DEFAULT_CONFIG_NAME
    const configFile = path.resolve(workingDir, configFileName)

    if (!fs.existsSync(configFile)) {
      throw(`ERROR: Config file ${configFileName} could not be found. Make sure that is exists.`)
    }

    // console.log('CWD:', process.cwd())

    const userConfigString = fs.readFileSync(configFile, 'utf-8')
    const userConfig = JSON.parse(userConfigString)

    return userConfig
  } catch (e) {
    throw new Error(e)
  }
}
