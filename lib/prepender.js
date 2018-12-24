const utils = require('../lib/utils')

const prepend = (advancedScriptText, variables = {}) => {
  return _replaceVar(advancedScriptText, variables)
}

const _replaceVar = (advancedScriptText, variables) => {
  return advancedScriptText
    .split('\n')
    .map((line) => {
      const match = line.match(/([A-Z][A-Za-z]+) /)

      if (!match) return line

      return _replaceLineVar(line, match[1], variables)
    })
    .join('\n')
}

const _replaceLineVar = (line, conditionName, variables) => {
  switch (conditionName) {
    case 'Class':
    case 'BaseType':
    case 'Prophecy':
    case 'HasExplicitMod':
      return _replaceArrayVar(line, variables)
    case 'ShaperItem':
    case 'ElderItem':
    case 'Corrupted':
    case 'Identified':
    case 'ShapedMap':
    case 'DisableDropSound':
      return _replaceBoolVar(line, variables)
    default:
      return _replaceOtherVar(line, variables)
  }
}

const _replaceArrayVar = (line, variables) => {
  let result = line
  _forEachVar(line, (varStr, varName) => {
    const varVal = variables[varName]
    let temp = Array.isArray(varVal) ? varVal : [varVal]
    result = result.replace(varStr, temp.map((t) => `"${t}"`).join(' '))
  })
  return result
}

const _replaceBoolVar = (line, variables) => {
  let result = line
  _forEachVar(line, (varStr, varName) => {
    result = result.replace(varStr, utils.toUpperFirstChar(variables[varName]))
  })
  return result
}

const _replaceOtherVar = (line, variables) => {
  let result = line
  _forEachVar(line, (varStr, varName) => {
    result = result.replace(varStr, variables[varName])
  })
  return result
}

const _forEachVar = (line, callback) => {
  const match = line.match(/Var\([^(|^)]+\)/g)
  if (!match) return
  match.forEach((varStr) => {
    const match = varStr.match(/Var\((.+)\)/)
    callback(match[0], match[1])
  })
}

module.exports = {
  prepend,
}
