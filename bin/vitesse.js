#!/usr/bin/env node

function start() {
  console.log('call func start')
  return import('../dist/node/cli.js')
}

start()
