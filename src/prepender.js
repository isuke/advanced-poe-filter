import { mapVals, toUpperFirstChar } from '../src/utils'

export default class {
  constructor(advancedScriptText = '', variables = {}, props = {}, options = {}) {
    this.advancedScriptText = advancedScriptText
    this.variables = variables
    this.props = props
    this.options = options
  }

  set advancedScriptText(val) {
    this.$advancedScriptText = val
  }

  set variables(val) {
    this.$variables = val
  }

  set props(val) {
    this.$props = val
  }

  set options(val) {
    this.$options = val
  }

  prepend() {
    let result = this.$advancedScriptText
    result = this._replaceProps(result, this.$props)
    result = this._replaceVariables(result, this._expandVariables())
    return result
  }

  _expandVariables() {
    return mapVals(this.$variables, (item, _name) => this._expandItem(this.$variables, item))
  }

  _expandItem(variables, item, count = 0) {
    if (count >= 10) throw new Error('nest is too deep')

    if (Array.isArray(item)) {
      return item.map((value) => this._expandValue(variables, value, count)).flat()
    } else {
      return this._expandValue(variables, item, count)
    }
  }

  _expandValue(variables, value, count) {
    if (typeof value === 'string') {
      const match = value.match(/# *(.*)/)
      return match ? this._expandItem(variables, variables[match[1]], count + 1) : value
    } else {
      return value
    }
  }

  _replaceVariables(advancedScriptText, variables) {
    return this._replaceFunction(advancedScriptText, 'Var', variables)
  }

  _replaceProps(advancedScriptText, props) {
    return this._replaceFunction(advancedScriptText, 'Prop', props)
  }

  _replaceFunction(advancedScriptText, functionName, valueObject) {
    return advancedScriptText
      .split('\n')
      .map((line) => this._convertLine(line, functionName, valueObject))
      .join('\n')
  }

  _convertLine(line, functionName, valueObject) {
    const functionStrs = line.match(new RegExp(`${functionName}\\("[^(|^)]+"\\)`, 'g')) || []

    if (functionStrs.length === 0) return line

    const lineMatch = line.match(/([A-Z][A-Za-z]+) ([^\n]+)/)

    if (lineMatch) {
      const ruleName = lineMatch[1]

      return functionStrs.reduce((acc, functionStr) => {
        const match = functionStr.match(new RegExp(`${functionName}\\("(.+)"\\)`))
        if (!valueObject.hasOwnProperty(match[1])) throw new Error(`'${match[1]}' is not found`)
        return acc.replace(match[0], this._convertValue(ruleName, valueObject[match[1]]))
      }, line)
    } else {
      return functionStrs.reduce((acc, functionStr) => {
        const match = functionStr.match(new RegExp(`${functionName}\\("(.+)"\\)`))
        if (!valueObject.hasOwnProperty(match[1])) throw new Error(`'${match[1]}' is not found`)
        return acc.replace(match[0], valueObject[match[1]])
      }, line)
    }
  }

  _convertValue(ruleName, value) {
    switch (ruleName) {
      case 'Class':
      case 'BaseType':
      case 'Prophecy':
      case 'HasExplicitMod':
        return (Array.isArray(value) ? value : [value]).map((t) => `"${t}"`).join(' ')
      case 'ShaperItem':
      case 'ElderItem':
      case 'Corrupted':
      case 'Identified':
      case 'ShapedMap':
      case 'ElderMap':
      case 'BlightedMap':
      case 'DisableDropSound':
        return toUpperFirstChar(value)
      default:
        return value
    }
  }
}
