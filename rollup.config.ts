import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import nodePolyfills from 'rollup-plugin-node-polyfills';
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
// import MagicString from 'magic-string'
import type { RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString(),
)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const sharedNodeOptions = defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    propertyReadSideEffects: false,
    tryCatchDeoptimization: false,
  },
  output: {
    dir: './dist',
    entryFileNames: `node/[name].js`,
    chunkFileNames: 'node/chunks/dep-[hash].js',
    exports: 'named',
    format: 'esm',
    externalLiveBindings: false,
    freeze: false,
  },
  onwarn(warning, warn) {
    if (warning.message.includes('Circular dependency')) {
      return
    }
    warn(warning)
  },
})

function createNodePlugins(
  isProduction: boolean,
  sourceMap: boolean,
  declarationDir: string | false,
): (any)[] {
  return [
    // nodePolyfills(),
    nodeResolve({ preferBuiltins: true }),
    typescript({
      tsconfig: path.resolve(__dirname, 'src/node/tsconfig.json'),
      sourceMap,
      declaration: declarationDir !== false,
      declarationDir: declarationDir !== false ? declarationDir : undefined,
    }),
    commonjs({
      extensions: ['.js'],
      // Optional peer deps of ws. Native deps that are mostly for performance.
      // Since ws is not that perf critical for us, just ignore these deps.
      ignore: ['bufferutil', 'utf-8-validate'],
    }),
    json(),
    // cjsPatchPlugin(),
  ]
}

function createNodeConfig(isProduction: boolean) {
  return defineConfig({
    ...sharedNodeOptions,
    input: {
      cli: path.resolve(__dirname, 'src/node/cli.ts'),
      constants: path.resolve(__dirname, 'src/node/constants.ts'),
    },
    output: {
      ...sharedNodeOptions.output,
      sourcemap: !isProduction,
    },
    external: [
      'vite',
      'svg-sprite', // move these to 'dependencies'? or move all to dependencies? whats the difference in this setup?
      ...Object.keys(pkg.dependencies),
      ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
    ],
    plugins: createNodePlugins(
      isProduction,
      !isProduction,
      // in production we use api-extractor for dts generation
      // in development we need to rely on the rollup ts plugin
      isProduction ? false : './dist/node',
    ),
  })
}

// function createCjsConfig(isProduction: boolean) {
//   return defineConfig({
//     ...sharedNodeOptions,
//     input: {
//       publicUtils: path.resolve(__dirname, 'src/node/publicUtils.ts'),
//     },
//     output: {
//       dir: './dist',
//       entryFileNames: `node-cjs/[name].cjs`,
//       chunkFileNames: 'node-cjs/chunks/dep-[hash].js',
//       exports: 'named',
//       format: 'cjs',
//       externalLiveBindings: false,
//       freeze: false,
//       sourcemap: false,
//     },
//     external: [
//       ...Object.keys(pkg.dependencies),
//       ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
//     ],
//     plugins: [...createNodePlugins(false, false, false)],
//   })
// }

/**
 * Inject CJS Context for each deps chunk
 */
// function cjsPatchPlugin(): any {
//   const cjsPatch = `
// import { fileURLToPath as __cjs_fileURLToPath } from 'node:url';
// import { dirname as __cjs_dirname } from 'node:path';
// import { createRequire as __cjs_createRequire } from 'node:module';

// const __filename = __cjs_fileURLToPath(import.meta.url);
// const __dirname = __cjs_dirname(__filename);
// const require = __cjs_createRequire(import.meta.url);
// const __require = require;
// `.trimStart()

//   return {
//     name: 'cjs-chunk-patch',
//     renderChunk(code: any, chunk: any) {
//       if (!chunk.fileName.includes('chunks/dep-')) return

//       const match = code.match(/^(?:import[\s\S]*?;\s*)+/)
//       const index = match ? match.index! + match[0].length : 0
//       const s = new MagicString(code)
//       // inject after the last `import`
//       s.appendRight(index, cjsPatch)
//       console.log('patched cjs context: ' + chunk.fileName)

//       return {
//         code: s.toString(),
//         map: s.generateMap({ hires: true }),
//       }
//     },
//   }
// }

export default (commandLineArgs: any): RollupOptions[] => {
  const isDev = commandLineArgs.watch // ToDo: check if this is really utilized
  const isProduction = !isDev

  return defineConfig([
    createNodeConfig(isProduction),
    // createCjsConfig(isProduction)
  ])
}
