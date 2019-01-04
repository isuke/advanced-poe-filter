import prepend from '../src/prepender'
import { parse } from '../lib/parser'
import expand from '../src/expander'
import generate from '../src/generator'

import { forIn, mapVals } from '../src/utils'

const getObject = (advancedScriptText, variables = {}, properties = {}) => {
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

const compile = (advancedScriptText, variables = {}, properties = {}) => {
  return mapVals(getObject(advancedScriptText, variables, properties), (val, _key) => generate(val))
}

export { getObject, compile }
