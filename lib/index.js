const parser = require('../dist/parser')
const expander = require('../lib/expander')
const generator = require('../lib/generator')

const compile = (advancedScriptText) => {
  return generator.generate(expander.expand(parser.parse(advancedScriptText)))
}

module.exports = {
  compile,
}
