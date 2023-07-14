import path from 'node:path'
import fs from 'node:fs'
import File from 'vinyl'
import SVGSpriter from 'svg-sprite'
import { globSync } from 'glob'
import chokidar from 'chokidar'

async function buildSpritemap(userSettings: any, options: any) {
  const inputFiles = userSettings.spritemap.inputFiles ? path.resolve(process.cwd(), userSettings.spritemap.inputFiles) : path.resolve(process.cwd(), './Resources/Public/Images/SVG-Icons/**/*.svg') // default aus constants nehmen und auf || umschreiben
  const outputDir = userSettings.spritemap.outputPath ? path.resolve(process.cwd(), userSettings.spritemap.outputPath) : path.resolve(process.cwd(), './Resources/Public/Images/') // default aus constants nehmen und auf || umschreiben
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
      for (const file of files) {
        spriter.add(new File({
          path: file,
          base: process.cwd(),
          contents: fs.readFileSync(file)
        }));
      }

      spriter.compile((error, result) => {
        for (const mode in result) {
          for (const resource in result[mode]) {
            fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
            fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
          }
        }
      })
    }
    catch (e) {
      throw e;
    }
    finally {
      console.log('wrote this and that svg file')
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
