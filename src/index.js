const prepender = require('../src/prepender')
const parser = require('../lib/parser')
const expander = require('../src/expander')
const generator = require('../src/generator')

const utils = require('../src/utils')

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
