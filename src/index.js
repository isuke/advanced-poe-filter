import prepend from '../src/prepender'
import { parse } from '../lib/parser'
import expand from '../src/expander'
import Generator from '../src/generator'

import { forIn, mapVals } from '../src/utils'

import pk from '../package.json'

const version = pk.version

const getObject = (advancedScriptText, variables = {}, properties = {}, _name = '') => {
  let result = {}
  if (Object.keys(properties).length === 0) {
    result['No Name'] = expand(parse(prepend(advancedScriptText, variables)))
  } else {
    forIn(properties, (props, key) => {
      result[key] = expand(parse(prepend(advancedScriptText, variables, props)))
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
