import { forIn, assignImmutable, mapObject, toUpperFirstChar } from '../src/utils'

export default class {
  constructor(scriptObject = {}, version = '', scriptName = '', filterName = '', options = {}) {
    this.scriptObject = scriptObject
    this.version = version
    this.scriptName = scriptName
    this.filterName = filterName
    this.options = options
  }

  set scriptObject(val) {
    this.$scriptObject = val
  }
  set version(val) {
    this.$version = val
  }
  set scriptName(val) {
    this.$scriptName = val
  }
  set filterName(val) {
    this.$filterName = val
  }
  set options(val) {
    this.$options = val
  }

  generate() {
    return this.$scriptObject.reduce((acc, sectionObject, i) => {
      return acc + this._generateSection(sectionObject, i === this.$scriptObject.length - 1)
    }, this._generateHeader())
  }

  _generateHeader() {
    const name = `${this.$filterName}${this.$scriptName ? ` (${this.$scriptName})` : ''}`

    let result = ''
    result += `${'#'.repeat(80)}\n`
    result += `#${' '.repeat(78)}#\n`
    if (name) result += `# ${name} ${' '.repeat(80 - name.length - 5)} #\n`
    result += `# Created By Advanced PoE Filter (Ver: ${this.$version}) ${' '.repeat(33)}#\n`
    result += `#${' '.repeat(78)}#\n`
    result += `${'#'.repeat(80)}\n`
    result += '\n'

    return result
  }

  _generateSection(sectionObject, isLast = false) {
    let result = ''
    result += `${'#'.repeat(80)}\n`
    result += `# ${sectionObject.name} ${' '.repeat(80 - sectionObject.name.length - 5)} #\n`
    result += `${'#'.repeat(80)}\n`

    result = sectionObject.blocks.reduce((acc, blockObject) => {
      return acc + this._generateBlock(blockObject)
    }, result)

    if (sectionObject.blocks.length === 1 && !isLast) result += '\n'

    return result
  }

  _generateBlock(blockObject) {
    let result = ''
    result += this._generateBlockName(blockObject.name)
    if (blockObject.activity === 'Unset') {
      result += '# Unset\n'
    } else {
      result += `${blockObject.activity}\n`
      result += this._generateConditions(blockObject)
      result += this._generateActions(blockObject)
    }
    result += '\n'

    return result
  }

  _generateBlockName(blockNameObject) {
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

  _generateConditions(blockObject) {
    return mapObject(blockObject.conditions, (val, key) => {
      return this._generateCondition(val, key)
    }).join('')
  }

  _generateCondition(conditionVal, conditionKey) {
    switch (conditionKey) {
      case 'Class':
      case 'BaseType':
      case 'Prophecy':
      case 'HasExplicitMod':
      case 'HasEnchantment':
        return `    ${conditionKey} ${conditionVal.map((v) => `"${v}"`).join(' ')}\n`
      case 'ShaperItem':
      case 'ElderItem':
      case 'Corrupted':
      case 'Identified':
      case 'ShapedMap':
      case 'FracturedItem':
      case 'SynthesisedItem':
      case 'AnyEnchantment':
        return `    ${conditionKey} ${toUpperFirstChar(conditionVal)}\n`
      default:
        return `    ${conditionKey} ${conditionVal}\n`
    }
  }

  _generateActions(blockObject) {
    if (blockObject.activity === 'Show') {
      return mapObject(this._createShowActions(blockObject.actions), (val, key) => {
        return this._generateAction(val, key)
      }).join('')
    } else {
      return mapObject(this._createHideActions(blockObject.actions), (val, key) => {
        return this._generateAction(val, key)
      }).join('')
    }
  }

  _createShowActions(actions) {
    let defaultActions = {}
    if (this.$options.initialFontSize) defaultActions.SetFontSize = this.$options.initialFontSize
    let result = assignImmutable(defaultActions, actions)
    if (this.$options.removeCustomAlertSound) delete result.CustomAlertSound
    return result
  }

  _createHideActions(actions) {
    let defaultActions = {}
    if (this.$options.initialFontSize) defaultActions.SetFontSize = this.$options.initialFontSize
    if (this.$options.addDisableDropSoundToHideBlock) defaultActions.DisableDropSound = true

    let result = assignImmutable(defaultActions, actions)
    delete result.PlayAlertSound
    delete result.PlayAlertSoundPositional
    delete result.CustomAlertSound
    delete result.MinimapIcon
    delete result.PlayEffect
    return result
  }

  _generateAction(actionVal, actionKey) {
    switch (actionKey) {
      case 'SetBorderColor':
      case 'SetTextColor':
      case 'SetBackgroundColor':
        return `    ${actionKey} ${Math.round(actionVal.rgb.r)} ${Math.round(actionVal.rgb.g)} ${Math.round(actionVal.rgb.b)} ${Math.round(actionVal.alpha)}\n`
      case 'PlayAlertSound':
      case 'PlayAlertSoundPositional':
        if (this.$options.convertPlayAlertSoundPositionalToPlayAlertSound) {
          return `    PlayAlertSound ${actionVal.id} ${actionVal.volume}\n`
        } else {
          return `    ${actionKey} ${actionVal.id} ${actionVal.volume}\n`
        }
      case 'DisableDropSound':
        return `    ${actionKey} ${toUpperFirstChar(actionVal)}\n`
      case 'CustomAlertSound':
        return `    ${actionKey} "${actionVal}"\n`
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
      case 'PlayEffect':
        if (actionVal.temp) {
          return `    ${actionKey} ${actionVal.color} Temp\n`
        } else {
          return `    ${actionKey} ${actionVal.color}\n`
        }
      default:
        return `    ${actionKey} ${actionVal}\n`
    }
  }
}
