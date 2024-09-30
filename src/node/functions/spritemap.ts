import path from 'node:path'
import fs from 'node:fs'
// import File from 'vinyl'
import SVGSpriter from 'svg-sprite'
import { globSync } from 'glob'
import chokidar from 'chokidar'
import pc from 'picocolors'

async function buildSpritemap(userSettings: any, options: any) {
  const inputFiles = userSettings.spritemap.inputFiles ? path.resolve(process.cwd(), userSettings.spritemap.inputFiles) : path.resolve(process.cwd(), './Resources/Private/Images/SVG-Icons/**/*.svg') // default aus constants nehmen
  const outputDir = userSettings.spritemap.outputPath ? path.resolve(process.cwd(), userSettings.spritemap.outputPath) : path.resolve(process.cwd(), './Resources/Public/Images/') // default aus constants nehmen
  const outputName = userSettings.spritemap.outputFileName || 'svg-icons.svg'
  const prefix = userSettings.spritemap.prefix || ''

  const build = () => {
    try {
      const spriter = new SVGSpriter({
        dest: outputDir,
        mode: {
          symbol: {
            dest: './',
            sprite: outputName
          }
        },
        shape: {
          id: {
            generator: function(name, file) { return `${prefix}${file.stem}` }
          }
        },
        svg: {
          namespaceIDs: false
        }
      })

      const files = globSync(inputFiles)
      if (!files.length) {
        console.log(pc.yellow(`⚠ No SVG files could be found in ${inputFiles}`))
        return
      }
      for (const file of files) {
        spriter.add(file, null, fs.readFileSync(file, 'utf-8'));
      }

      spriter.compile((error, result) => {
        for (const mode in result) {
          for (const resource in result[mode]) {
            fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
            fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
            console.log(`Added SVG-Spritemap:`, pc.cyan(result[mode][resource].path))
          }
        }
      })
    }
    catch (e) {
      throw e;
    }
    finally {
      console.log(pc.green(`✓ Building SVG-Spritemaps complete`))
    }
  }

  build()

  if (options.watch) {
    chokidar.watch(inputFiles, {
      ignoreInitial: true
    }).on('all', (event, path) => {
      build()
    })
  }
}

export default buildSpritemap
