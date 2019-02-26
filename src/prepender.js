import { mapVals, toUpperFirstChar } from '../src/utils'

const prepend = (advancedScriptText, variables = {}, props = {}) => {
  let result = advancedScriptText
  result = _replaceProps(result, props)
  result = _replaceVariables(result, _expandVariables(variables))
  return result
}

const _expandVariables = (variables) => {
  return mapVals(variables, (item, _name) => _expandItem(variables, item))
}

const _expandItem = (variables, item, count = 0) => {
  if (count >= 10) throw new Error('nest is too deep')

  if (Array.isArray(item)) {
    return item.map((value) => _expandValue(variables, value, count)).flat()
  } else {
    return _expandValue(variables, item, count)
  }
}

const _expandValue = (variables, value, count) => {
  if (typeof value === 'string') {
    const match = value.match(/# *(.*)/)
    return match ? _expandItem(variables, variables[match[1]], count + 1) : value
  } else {
    return value
  }
}

const _replaceVariables = (advancedScriptText, variables) => {
  return _replaceFunction(advancedScriptText, 'Var', variables)
}

const _replaceProps = (advancedScriptText, props) => {
  return _replaceFunction(advancedScriptText, 'Prop', props)
}

const _replaceFunction = (advancedScriptText, functionName, valueObject) => {
  return advancedScriptText
    .split('\n')
    .map((line) => _convertLine(line, functionName, valueObject))
    .join('\n')
}

const _convertLine = (line, functionName, valueObject) => {
  const functionStrs = line.match(new RegExp(`${functionName}\\("[^(|^)]+"\\)`, 'g')) || []

  if (functionStrs.length === 0) return line

  const lineMatch = line.match(/([A-Z][A-Za-z]+) ([^\n]+)/)

  if (lineMatch) {
    const ruleName = lineMatch[1]

    return functionStrs.reduce((acc, functionStr) => {
      const match = functionStr.match(new RegExp(`${functionName}\\("(.+)"\\)`))
      if (!valueObject.hasOwnProperty(match[1])) throw new Error(`'${match[1]}' is not found`)
      return acc.replace(match[0], _convertValue(ruleName, valueObject[match[1]]))
    }, line)
  } else {
    return functionStrs.reduce((acc, functionStr) => {
      const match = functionStr.match(new RegExp(`${functionName}\\("(.+)"\\)`))
      if (!valueObject.hasOwnProperty(match[1])) throw new Error(`'${match[1]}' is not found`)
      return acc.replace(match[0], valueObject[match[1]])
    }, line)
  }
}

const _convertValue = (ruleName, value) => {
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
    case 'DisableDropSound':
      return toUpperFirstChar(value)
    default:
      return value
  }
}

export default prepend
