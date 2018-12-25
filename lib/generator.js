const utils = require('../lib/utils')

const generate = (scriptObject) => {
  return scriptObject.reduce((acc, sectionObject, i) => {
    return acc + _generateSection(sectionObject, i === scriptObject.length - 1)
  }, '')
}

const _generateSection = (sectionObject, isLast = false) => {
  let result = ''
  result += `${'#'.repeat(80)}\n`
  result += `# ${sectionObject.name} ${' '.repeat(80 - sectionObject.name.length - 5)} #\n`
  result += `${'#'.repeat(80)}\n`

  result = sectionObject.blocks.reduce((acc, blockObject) => {
    return acc + _generateBlock(blockObject)
  }, result)

  if (sectionObject.blocks.length === 1 && !isLast) result += '\n'

  return result
}

const _generateBlock = (blockObject) => {
  let result = ''
  result += _generateBlockName(blockObject.name)
  result += `${blockObject.activity}\n`
  result += _generateConditions(blockObject)
  result += _generateActions(blockObject)
  result += '\n'

  return result
}

const _generateBlockName = (blockNameObject) => {
  if (Object.keys(blockNameObject).length === 0) return ''

  let temp = []
  utils.forIn(blockNameObject, (val, key) => {
    if (val) {
      temp.push(`${key} is "${val}"`)
    } else {
      temp.push(`${key} is Any`)
    }
  })
  return `# ${temp.join(' - ')}\n`
}

const _generateConditions = (blockObject) => {
  return utils
    .mapObject(blockObject.conditions, (val, key) => {
      return _generateCondition(val, key)
    })
    .join('')
}

const _generateCondition = (conditionVal, conditionKey) => {
  switch (conditionKey) {
    case 'Class':
    case 'BaseType':
    case 'Prophecy':
    case 'HasExplicitMod':
      return `    ${conditionKey} ${conditionVal.map((v) => `"${v}"`).join(' ')}\n`
    case 'ShaperItem':
    case 'ElderItem':
    case 'Corrupted':
    case 'Identified':
    case 'ShapedMap':
      return `    ${conditionKey} ${utils.toUpperFirstChar(conditionVal)}\n`
    default:
      return `    ${conditionKey} ${conditionVal}\n`
  }
}

const _generateActions = (blockObject) => {
  if (blockObject.activity === 'Show') {
    return utils
      .mapObject(blockObject.actions, (val, key) => {
        return _generateAction(val, key)
      })
      .join('')
  } else {
    return utils
      .mapObject({ DisableDropSound: 'True' }, (val, key) => {
        return _generateAction(val, key)
      })
      .join('')
  }
}

const _generateAction = (actionVal, actionKey) => {
  switch (actionKey) {
    case 'SetBorderColor':
    case 'SetTextColor':
    case 'SetBackgroundColor':
      return `    ${actionKey} ${Math.round(actionVal.rgb.r)} ${Math.round(actionVal.rgb.g)} ${Math.round(actionVal.rgb.b)} ${Math.round(actionVal.alpha)}\n`
    case 'DisableDropSound':
      return `    ${actionKey} ${utils.toUpperFirstChar(actionVal)}\n`
    default:
      return `    ${actionKey} ${actionVal}\n`
  }
}

module.exports = {
  generate,
}
