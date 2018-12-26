const utils = require('../lib/utils')

const prepend = (advancedScriptText, variables = {}, props = {}) => {
  let result = advancedScriptText
  result = _removeComments(result)
  result = _removeBlankLines(result)
  result = _replaceVariables(result, variables)
  result = _replaceProps(result, props)
  return result
}

const _removeComments = (advancedScriptText) => {
  return advancedScriptText.replace(/ *#.*\n/g, '')
}

const _removeBlankLines = (advancedScriptText) => {
  return advancedScriptText
    .split('\n')
    .filter((a) => a)
    .map((a) => `${a}\n`)
    .join('')
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
  const lineMatch = line.match(/([A-Z][A-Za-z]+) ([^\n]+)/)

  if (!lineMatch) return line

  const ruleName = lineMatch[1]
  const valuesStr = lineMatch[2]

  const functionStrs = valuesStr.match(new RegExp(`${functionName}\\([^(|^)]+\\)`, 'g')) || []

  return functionStrs.reduce((acc, functionStr) => {
    const match = functionStr.match(new RegExp(`${functionName}\\((.+)\\)`))
    return acc.replace(match[0], _convertValue(ruleName, valueObject[match[1]]))
  }, line)
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
      return utils.toUpperFirstChar(value)
    default:
      return value
  }
}

module.exports = {
  prepend,
}
