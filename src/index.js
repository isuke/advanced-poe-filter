import Prepender from '../src/prepender'
import { parse } from '../lib/parser'
import Expander from '../src/expander'
import Generator from '../src/generator'

import { forIn, mapVals } from '../src/utils'

import pk from '../package.json'

const version = pk.version

const getObject = (advancedScriptText, variables = {}, properties = {}, _name = '') => {
  let result = {}
  if (Object.keys(properties).length === 0) {
    const prepender = new Prepender(advancedScriptText, variables)
    const expander = new Expander(parse(prepender.prepend()))

    result['No Name'] = expander.expand()
  } else {
    forIn(properties, (props, key) => {
      const prepender = new Prepender(advancedScriptText, variables, props)
      const expander = new Expander(parse(prepender.prepend()))

      result[key] = expander.expand()
    })
  }
  return result
}

const compile = (advancedScriptText, variables = {}, properties = {}, name = '') => {
  return mapVals(getObject(advancedScriptText, variables, properties), (val, key) => {
    const generator = key === 'No Name' ? new Generator(val, version, '', name) : new Generator(val, version, key, name)

    return generator.generate()
  })
}

export { version, getObject, compile }
