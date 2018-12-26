const prepender = require('../lib/prepender')
const parser = require('../dist/parser')
const expander = require('../lib/expander')
const generator = require('../lib/generator')

const utils = require('../lib/utils')

const compile = (advancedScriptText, variables = {}, properties = {}) => {
  let result = {}
  if (Object.keys(properties).length === 0) {
    result['No Name'] = generator.generate(expander.expand(parser.parse(prepender.prepend(advancedScriptText, variables))))
  } else {
    utils.forIn(properties, (props, key) => {
      result[key] = generator.generate(expander.expand(parser.parse(prepender.prepend(advancedScriptText, variables, props))))
    })
  }
  return result
}

module.exports = {
  compile,
}
