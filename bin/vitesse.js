#!/usr/bin/env node
// import packageInfo from '../package.json' with { type: "json" } // prepare, not stable support yet (with or assert)

function start() {
  console.log('🆅 🅸 🆃 🅴 🆂 🆂 🅴')
  // console.log(packageInfo.version)
  return import('../dist/node/cli.js')
}

start()
