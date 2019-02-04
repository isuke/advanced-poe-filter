import { forIn, assignImmutable, mapObject, toUpperFirstChar } from '../src/utils'

const generate = (scriptObject, version = '', scriptName = '', filterName = '') => {
  return scriptObject.reduce((acc, sectionObject, i) => {
    return acc + _generateSection(sectionObject, i === scriptObject.length - 1)
  }, _generateHeader(version, scriptName, filterName))
}

const _generateHeader = (version, scriptName, filterName) => {
  const name = `${filterName}${scriptName ? ` (${scriptName})` : ''}`

  let result = ''
  result += `${'#'.repeat(80)}\n`
  result += `#${' '.repeat(78)}#\n`
  if (name) result += `# ${name} ${' '.repeat(80 - name.length - 5)} #\n`
  result += `# Created By Advanced PoE Filter (Ver: ${version}) ${' '.repeat(33)}#\n`
  result += `#${' '.repeat(78)}#\n`
  result += `${'#'.repeat(80)}\n`
  result += '\n'

  return result
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
  forIn(blockNameObject, (val, key) => {
    if (val) {
      temp.push(`${key} is "${val}"`)
    } else {
      temp.push(`${key} is Any`)
    }
  })
  return `# ${temp.join(' - ')}\n`
}

const _generateConditions = (blockObject) => {
  return mapObject(blockObject.conditions, (val, key) => {
    return _generateCondition(val, key)
  }).join('')
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
      return `    ${conditionKey} ${toUpperFirstChar(conditionVal)}\n`
    default:
      return `    ${conditionKey} ${conditionVal}\n`
  }
}

const _generateActions = (blockObject) => {
  if (blockObject.activity === 'Show') {
    return mapObject(blockObject.actions, (val, key) => {
      return _generateAction(val, key)
    }).join('')
  } else {
    return mapObject(_createHideActions(blockObject.actions), (val, key) => {
      return _generateAction(val, key)
    }).join('')
  }
}

const _createHideActions = (actions) => {
  const hideDefaultActions = {
    DisableDropSound: true,
  }
  let result = assignImmutable(hideDefaultActions, actions)
  delete result.PlayAlertSound
  delete result.PlayAlertSoundPositional
  delete result.CustomAlertSound
  delete result.MinimapIcon
  delete result.PlayEffect
  return result
}

const _generateAction = (actionVal, actionKey) => {
  switch (actionKey) {
    case 'SetBorderColor':
    case 'SetTextColor':
    case 'SetBackgroundColor':
      return `    ${actionKey} ${Math.round(actionVal.rgb.r)} ${Math.round(actionVal.rgb.g)} ${Math.round(actionVal.rgb.b)} ${Math.round(actionVal.alpha)}\n`
    case 'PlayAlertSound':
    case 'PlayAlertSoundPositional':
      return `    ${actionKey} ${actionVal.id} ${actionVal.volume}\n`
    case 'DisableDropSound':
      return `    ${actionKey} ${toUpperFirstChar(actionVal)}\n`
    case 'MinimapIcon':
      switch (actionVal.size) {
        case 'Largest':
          return `    ${actionKey} 0 ${actionVal.color} ${actionVal.shape}\n`
        case 'Medium':
          return `    ${actionKey} 1 ${actionVal.color} ${actionVal.shape}\n`
        case 'Small':
          return `    ${actionKey} 2 ${actionVal.color} ${actionVal.shape}\n`
      }
      break
    default:
      return `    ${actionKey} ${actionVal}\n`
  }
}

export default generate
