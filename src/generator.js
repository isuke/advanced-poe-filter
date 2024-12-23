import { forIn, assignImmutable, toUpperFirstChar } from "../src/utils.js"

export default class {
  constructor(scriptObject = {}, version = "", scriptName = "", filterInfo = {}, options = {}) {
    this.scriptObject = scriptObject
    this.version = version
    this.scriptName = scriptName
    this.filterInfo = filterInfo
    this.options = options
  }

  get conditionKeys() {
    return Object.freeze([
      "Class",
      "BaseType",
      "Rarity",

      "BaseDefencePercentile",
      "BaseArmour",
      "BaseEnergyShield",
      "BaseEvasion",
      "BaseWard",

      "DropLevel",
      "ItemLevel",
      "AreaLevel",
      "GemLevel",

      "TransfiguredGem",

      "StackSize",

      "MapTier",
      "WaystoneTier",

      "Quality",

      "LinkedSockets",
      "Sockets",
      "SocketGroup",

      "FracturedItem",
      "SynthesisedItem",

      "Corrupted",
      "Mirrored",
      "Identified",
      "Scourged",
      "ShapedMap",
      "ElderMap",
      "BlightedMap",
      "UberBlightedMap",

      "Height",
      "Width",

      "CorruptedMods",
      "EnchantmentPassiveNum",

      "HasExplicitMod",
      "HasImplicitMod",
      "HasEaterOfWorldsImplicit",
      "HasSearingExarchImplicit",
      "AnyEnchantment",
      "HasEnchantment",
      "HasInfluence",
      "EnchantmentPassiveNode",

      "Replica",

      "ArchnemesisMod",

      "HasCruciblePassiveTree",
    ])
  }

  get actionKeys() {
    return Object.freeze([
      "SetFontSize",
      "SetTextColor",
      "SetBackgroundColor",
      "SetBorderColor",

      "MinimapIcon",

      "PlayEffect",

      "PlayAlertSound",
      "PlayAlertSoundPositional",
      "CustomAlertSound",
      "CustomAlertSoundOptional",
      "DisableDropSoundIfAlertSound",
      "EnableDropSoundIfAlertSound",
      "DisableDropSound",
      "EnableDropSound",
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
    const filterName = this.$filterInfo.name ? this.$filterInfo.name : ""
    const scriptName = this.$scriptName ? ` - ${this.$scriptName} -` : ""
    const filterVersion = this.$filterInfo.version ? ` (Ver: ${this.$filterInfo.version})` : ""
    const name = `${filterName}${scriptName}${filterVersion}`

    let result = ""
    result += `${"#".repeat(80)}\n`
    result += `#${" ".repeat(78)}#\n`
    if (name) result += `# ${name} ${" ".repeat(80 - name.length - 5)} #\n`
    result += `# Created By Advanced PoE Filter (Ver: ${this.$version}) ${" ".repeat(80 - this.$version.length - 42)}#\n`
    result += `#${" ".repeat(78)}#\n`
    result += `${"#".repeat(80)}\n`
    result += "\n"

    return result
  }

  _generateSection(sectionObject, isLast = false) {
    let result = ""
    result += `${"#".repeat(80)}\n`
    result += `# ${sectionObject.name} ${" ".repeat(80 - sectionObject.name.length - 5)} #\n`
    result += `${"#".repeat(80)}\n`

    result = sectionObject.blocks.reduce((acc, blockObject) => {
      return acc + this._generateBlock(blockObject)
    }, result)

    if (sectionObject.blocks.length === 1 && !isLast) result += "\n"

    return result
  }

  _generateBlock(blockObject) {
    let result = ""
    result += this._generateBlockName(blockObject.name)
    if (blockObject.activity === "Unset") {
      result += "# Unset\n"
    } else {
      result += `${blockObject.activity}\n`
      result += this._generateConditions(blockObject)
      result += this._generateActions(blockObject)
    }
    result += "\n"

    return result
  }

  _generateBlockName(blockNameObject) {
    if (Object.keys(blockNameObject).length === 0) return ""

    let temp = []
    forIn(blockNameObject, (val, key) => {
      if (val) {
        temp.push(`${key} is "${val}"`)
      } else {
        temp.push(`${key} is Any`)
      }
    })
    return `# ${temp.join(" - ")}\n`
  }

  _generateConditions(blockObject) {
    return this.conditionKeys
      .map((conditionKey) => {
        return Object.prototype.hasOwnProperty.call(blockObject.conditions, conditionKey)
          ? this._generateCondition(blockObject.conditions[conditionKey], conditionKey)
          : ""
      })
      .join("")
  }

  _generateCondition(conditionVal, conditionKey) {
    switch (conditionKey) {
      // Boolean
      case "TransfiguredGem":
      case "Corrupted":
      case "Mirrored":
      case "Identified":
      case "Scourged":
      case "ShapedMap":
      case "ElderMap":
      case "BlightedMap":
      case "UberBlightedMap":
      case "FracturedItem":
      case "SynthesisedItem":
      case "AnyEnchantment":
      case "Replica":
      case "HasImplicitMod":
      case "HasCruciblePassiveTree":
        return `    ${conditionKey} ${toUpperFirstChar(conditionVal)}\n`

      // Socket Type
      case "Sockets":
      case "SocketGroup":
        return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.val}\n`

      // Rarity
      case "Rarity":
        return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.val}\n`

      // Numeric
      case "DropLevel":
      case "ItemLevel":
      case "AreaLevel":
      case "GemLevel":
      case "StackSize":
      case "MapTier":
      case "WaystoneTier":
      case "Quality":
      case "LinkedSockets":
      case "BaseDefencePercentile":
      case "BaseArmour":
      case "BaseEnergyShield":
      case "BaseEvasion":
      case "BaseWard":
      case "Height":
      case "Width":
      case "CorruptedMods":
      case "EnchantmentPassiveNum":
        return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.val}\n`

      // Array
      case "Class":
      case "BaseType":
      case "EnchantmentPassiveNode":
      case "ArchnemesisMod":
        return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.vals.map((v) => `"${v}"`).join(" ")}\n`

      // Numeric and Array
      case "HasExplicitMod":
      case "HasEnchantment":
        if (conditionVal.numeric) {
          return `    ${conditionKey} ${conditionVal.numeric.ope} ${conditionVal.numeric.val} ${conditionVal.vals.map((v) => `"${v}"`).join(" ")}\n`
        } else {
          return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.vals.map((v) => `"${v}"`).join(" ")}\n`
        }

      // Array or None
      case "HasInfluence":
        if (conditionVal.ope) {
          return `    ${conditionKey} ${conditionVal.ope} ${conditionVal.vals.map((v) => `"${v}"`).join(" ")}\n`
        } else {
          return `    ${conditionKey} ${conditionVal.val}\n`
        }

      // Implicit Mod Tier
      case "HasEaterOfWorldsImplicit":
      case "HasSearingExarchImplicit":
        switch (conditionVal.val) {
          case "Lesser":
            return `    ${conditionKey} ${conditionVal.ope} 1\n`
          case "Greater":
            return `    ${conditionKey} ${conditionVal.ope} 2\n`
          case "Grand":
            return `    ${conditionKey} ${conditionVal.ope} 3\n`
          case "Exceptional":
            return `    ${conditionKey} ${conditionVal.ope} 4\n`
          case "Exquisite":
            return `    ${conditionKey} ${conditionVal.ope} 5\n`
          case "Perfect":
            return `    ${conditionKey} ${conditionVal.ope} 6\n`
        }
        break
    }
  }

  _generateActions(blockObject) {
    if (blockObject.activity === "Show") {
      const actions = this._createShowActions(blockObject.actions)
      return this.actionKeys
        .map((actionKey) => {
          return Object.prototype.hasOwnProperty.call(actions, actionKey) ? this._generateAction(actions[actionKey], actionKey) : ""
        })
        .join("")
    } else {
      const actions = this._createHideActions(blockObject.actions)
      return this.actionKeys
        .map((actionKey) => {
          return Object.prototype.hasOwnProperty.call(actions, actionKey) ? this._generateAction(actions[actionKey], actionKey) : ""
        })
        .join("")
    }
  }

  _createShowActions(actions) {
    let defaultActions = {}
    if (this.$options.initialFontSize) defaultActions.SetFontSize = this.$options.initialFontSize
    let result = assignImmutable(defaultActions, actions)
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
      case "SetBorderColor":
      case "SetTextColor":
      case "SetBackgroundColor":
        return `    ${actionKey} ${Math.round(actionVal.rgb.r)} ${Math.round(actionVal.rgb.g)} ${Math.round(actionVal.rgb.b)} ${Math.round(actionVal.alpha)}\n`
      case "PlayAlertSound":
      case "PlayAlertSoundPositional":
        return `    ${actionKey} ${actionVal.id} ${actionVal.volume}\n`
      case "CustomAlertSound":
      case "CustomAlertSoundOptional":
        return `    ${actionKey} "${actionVal.filePath}" ${actionVal.volume}\n`
      case "DisableDropSoundIfAlertSound":
      case "EnableDropSoundIfAlertSound":
      case "DisableDropSound":
      case "EnableDropSound":
        return `    ${actionKey}\n`
      case "MinimapIcon":
        switch (actionVal.size) {
          case "Large":
            return `    ${actionKey} 0 ${actionVal.color} ${actionVal.shape}\n`
          case "Medium":
            return `    ${actionKey} 1 ${actionVal.color} ${actionVal.shape}\n`
          case "Small":
            return `    ${actionKey} 2 ${actionVal.color} ${actionVal.shape}\n`
        }
        break
      case "PlayEffect":
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
