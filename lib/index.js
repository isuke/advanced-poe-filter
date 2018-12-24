const prepender = require('../lib/prepender')
const parser = require('../dist/parser')
const expander = require('../lib/expander')
const generator = require('../lib/generator')

const compile = (advancedScriptText, variables = {}) => {
  return generator.generate(expander.expand(parser.parse(prepender.prepend(advancedScriptText, variables))))
}

module.exports = {
  compile,
}
