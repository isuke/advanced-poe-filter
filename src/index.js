import { parse, SyntaxError as _SyntaxError } from "advanced-poe-filter-parser"

import Prepender from "../src/prepender.js"
import Expander from "../src/expander.js"
import Generator from "../src/generator.js"

import { assignImmutable, forIn, mapVals } from "../src/utils.js"

const version = "0.9.12"

const getObject = (advancedScriptText, variables = {}, properties = {}, _filterInfo = {}, originalOptions = undefined) => {
  const options = assignImmutable(_defaultOptions, originalOptions)
  const prepender = new Prepender(advancedScriptText, variables)
  const expander = new Expander()
  expander.options = options

  let result = {}
  if (Object.keys(properties).length === 0) {
    expander.advancedScriptObject = parse(prepender.prepend())

    result["No Name"] = expander.expand()
  } else {
    forIn(properties, (props, key) => {
      prepender.props = props
      expander.advancedScriptObject = parse(prepender.prepend())

      result[key] = expander.expand()
    })
  }
  return result
}

const compile = (advancedScriptText, variables = {}, properties = {}, filterInfo = {}, originalOptions = undefined) => {
  const options = assignImmutable(_defaultOptions, originalOptions)
  const generator = new Generator({}, version, "", filterInfo, options)

  return mapVals(getObject(advancedScriptText, variables, properties, filterInfo, options), (val, key) => {
    generator.scriptObject = val

    if (key !== "No Name") {
      generator.scriptName = key
    }

    return generator.generate()
  })
}

const _defaultOptions = {
  addDisableDropSoundToHideBlock: true,
  initialFontSize: 32,
}

export { version, getObject, compile }
