import prepend from '../src/prepender'
import { parse } from '../lib/parser'
import expand from '../src/expander'
import generate from '../src/generator'

import { forIn } from '../src/utils'

const compile = (advancedScriptText, variables = {}, properties = {}) => {
  let result = {}
  if (Object.keys(properties).length === 0) {
    result['No Name'] = generate(expand(parse(prepend(advancedScriptText, variables))))
  } else {
    forIn(properties, (props, key) => {
      result[key] = generate(expand(parse(prepend(advancedScriptText, variables, props))))
    })
  }
  return result
}

export { compile }
