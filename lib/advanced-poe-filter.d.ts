import { AdvancedBlock } from "advanced-poe-filter-parser"

type Block = {
  id: AdvancedBlock["id"]
  name: { [name: string]: string }
  activity: AdvancedBlock["activity"]
  conditions: AdvancedBlock["conditions"]
  actions: AdvancedBlock["actions"]
}

type PoeFilterObject = {
  [propertyName: string]: {
    name: string
    blocks: Block[]
  }[]
}

type Options = {
  addDisableDropSoundToHideBlock: boolean
  convertPlayAlertSoundPositionalToPlayAlertSound: boolean
  removeCustomAlertSound: boolean
  defaultAlertSoundVolume: number
  defaultAlertSoundPositionalVolume: number
  initialFontSize: number
}

export type version = `{number}.{number}.{number}`
export function getObject(advancedScriptText: string, variables?: object, properties?: object, _filterInfo?: object, originalOptions?: Options): PoeFilterObject
export function compile(advancedScriptText: string, variables?: object, properties?: object, filterInfo?: object, originalOptions?: Options): string
