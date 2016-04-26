#!/usr/bin/env node --es_staging --harmony_destructuring --harmony_destructuring --harmony_default_parameters

const program = require('commander')
const path = require('path')
const fs = require('fs')
const upsourceNotifier = require('../index')

program
  .option('-c, --config [file]', 'Config file path. Default: ./config.json')
  .parse(process.argv)

try {
  const configFile = path.resolve(program.config || 'config.json')
  fs.statSync(configFile)
  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))

  upsourceNotifier(config)
} catch (err) {
  console.error(err)
  program.outputHelp()
  process.exit(1)
}
