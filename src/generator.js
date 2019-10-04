import { forIn, assignImmutable, toUpperFirstChar } from '../src/utils'

export default class {
  constructor(scriptObject = {}, version = '', scriptName = '', filterInfo = {}, options = {}) {
    this.scriptObject = scriptObject
    this.version = version
    this.scriptName = scriptName
    this.filterInfo = filterInfo
    this.options = options
  }

  get conditionKeys() {
    return Object.freeze([
      'Class',
      'BaseType',
      'Rarity',

      'Prophecy',

      'DropLevel',
      'ItemLevel',
      'GemLevel',

      'StackSize',

      'MapTier',

      'Quality',

      'LinkedSockets',
      'Sockets',
      'SocketGroup',

      'ShaperItem',
      'ElderItem',
      'FracturedItem',
      'SynthesisedItem',

      'Corrupted',
      'Identified',
      'ShapedMap',
      'ElderMap',
      'BlightedMap',

      'Height',
      'Width',

      'HasExplicitMod',
      'AnyEnchantment',
      'HasEnchantment',
    ])
  }

  get actionKeys() {
    return Object.freeze([
      'SetFontSize',
      'SetTextColor',
      'SetBackgroundColor',
      'SetBorderColor',

      'MinimapIcon',

      'PlayEffect',

      'PlayAlertSound',
      'PlayAlertSoundPositional',
      'CustomAlertSound',
      'DisableDropSound',
    ])
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
  set filterInfo(val) {
    this.$filterInfo = val
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
    const filterName = this.$filterInfo.name ? this.$filterInfo.name : ''
    const scriptName = this.$scriptName ? ` - ${this.$scriptName} -` : ''
    const filterVersion = this.$filterInfo.version ? ` (Ver: ${this.$filterInfo.version})` : ''
    const name = `${filterName}${scriptName}${filterVersion}`

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
    return this.conditionKeys
      .map((conditionKey) => {
        return blockObject.conditions.hasOwnProperty(conditionKey) ? this._generateCondition(blockObject.conditions[conditionKey], conditionKey) : ''
      })
      .join('')
  }

  _generateCondition(conditionVal, conditionKey) {
    switch (conditionKey) {
      case 'Class':
      case 'BaseType':
      case 'Prophecy':
      case 'HasExplicitMod':
      case 'HasEnchantment':
        return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.vals.map((v) => `"${v}"`).join(' ')}\n`
      case 'ShaperItem':
      case 'ElderItem':
      case 'Corrupted':
      case 'Identified':
      case 'ShapedMap':
      case 'ElderMap':
      case 'BlightedMap':
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
      const actions = this._createShowActions(blockObject.actions)
      return this.actionKeys
        .map((actionKey) => {
          return actions.hasOwnProperty(actionKey) ? this._generateAction(actions[actionKey], actionKey) : ''
        })
        .join('')
    } else {
      const actions = this._createHideActions(blockObject.actions)
      return this.actionKeys
        .map((actionKey) => {
          return actions.hasOwnProperty(actionKey) ? this._generateAction(actions[actionKey], actionKey) : ''
        })
        .join('')
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
        return `    ${actionKey} ${actionVal.id} ${actionVal.volume || this.$options.defaultAlertSoundVolume}\n`
      case 'PlayAlertSoundPositional':
        if (this.$options.convertPlayAlertSoundPositionalToPlayAlertSound) {
          return `    PlayAlertSound ${actionVal.id} ${actionVal.volume || this.$options.defaultAlertSoundPositionalVolume}\n`
        } else {
          return `    ${actionKey} ${actionVal.id} ${actionVal.volume || this.$options.defaultAlertSoundPositionalVolume}\n`
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
