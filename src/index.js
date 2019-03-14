import Prepender from '../src/prepender'
import { parse } from '../lib/parser'
import Expander from '../src/expander'
import Generator from '../src/generator'

import { forIn, mapVals } from '../src/utils'

import pk from '../package.json'

const version = pk.version

const getObject = (advancedScriptText, variables = {}, properties = {}, _name = '', _options = {}) => {
  const prepender = new Prepender(advancedScriptText, variables)
  const expander = new Expander()

  let result = {}
  if (Object.keys(properties).length === 0) {
    expander.advancedScriptObject = parse(prepender.prepend())

    result['No Name'] = expander.expand()
  } else {
    forIn(properties, (props, key) => {
      prepender.props = props
      expander.advancedScriptObject = parse(prepender.prepend())

      result[key] = expander.expand()
    })
  }
  return result
}

const compile = (advancedScriptText, variables = {}, properties = {}, name = '', originalOptions = undefined) => {
  const options = originalOptions ? originalOptions : _defaultOptions
  const generator = new Generator({}, version, '', name, options)

  return mapVals(getObject(advancedScriptText, variables, properties), (val, key) => {
    generator.scriptObject = val

    if (key !== 'No Name') {
      generator.scriptName = key
    }

    return generator.generate()
  })
}

const _defaultOptions = {
  addDisableDropSoundToHideBlock: true,
  convertPlayAlertSoundPositionalToPlayAlertSound: false,
  initialFontSize: 32,
}

export { version, getObject, compile }
