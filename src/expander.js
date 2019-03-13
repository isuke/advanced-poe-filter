// @flow

import Color from 'color'

import { product, createObject, assignImmutable, forIn } from '../src/utils'

/*::
type AdvancedBlock = {
  id: string,
  name: string,
  activity: string,
  conditions: object,
  actions: object,
  branches: Array<Branch>,
}

type Branch = {
  name: string,
  type: string,
  blocks: Array<AdvancedBlock>,
}
*/

/*::
type Section = {
  name: string,
  blocks: Array<Block>,
}

type Block = {
  id: string,
  name: object,
  activity: string,
  conditions: object,
  actions: object,
}
*/

export default class {
  /*:: advancedScriptObject: Array<AdvancedBlock> */
  /*:: _variables: Object */
  /*:: _props: Object */
  /*:: _options: Object */

  constructor(advancedScriptObject /*: Array<AdvancedBlock> */, _variables /*: Object */ = {}, _props /*: Object */ = {}, _options /*: Object */ = {}) {
    this.advancedScriptObject = advancedScriptObject
    this._variables = _variables
    this._props = _props
    this._options = _options
  }

  expand() /*: Array<Section> */ {
    return this.advancedScriptObject.map((advancedBlock /*: AdvancedBlock */) => this._convertAdvancedBlockToSection(advancedBlock))
  }

  _convertAdvancedBlockToSection(advancedBlock /*: AdvancedBlock */) /*: Section */ {
    if (advancedBlock.branches.length === 0) {
      return {
        name: advancedBlock.name,
        blocks: [
          {
            id: advancedBlock.id,
            name: {},
            activity: advancedBlock.activity,
            conditions: advancedBlock.conditions,
            actions: advancedBlock.actions,
          },
        ],
      }
    } else {
      const producted /*: Array<Array<Block>> */ = product(...advancedBlock.branches.map((branch) => this._convertBranchToBlocks(branch)))

      return {
        name: advancedBlock.name,
        blocks: producted.map((p) => this._mergeBlocks(advancedBlock, ...p)),
      }
    }
  }

  _convertBranchToBlocks(branch /*: Branch */) /* Array<Block> */ {
    const sections /*: Array<Section> */ = branch.blocks.map((advancedBlock) => this._convertAdvancedBlockToSection(advancedBlock))

    let blocks /*: Array<Blocks> */ = sections.reduce((acc, section) => {
      const nameObject = createObject(branch.name, section.name)
      const blocks = section.blocks.map((block) => {
        return {
          id: block.id,
          name: assignImmutable(nameObject, block.name),
          activity: block.activity,
          conditions: block.conditions,
          actions: block.actions,
        }
      })
      return acc.concat(blocks)
    }, [])

    if (branch.type === 'Mixin') blocks = blocks.concat(this._emptyBlock(branch.name))
    return blocks
  }

  _mergeBlocks(advancedBlock /*: advancedBlock */, ...blocks /*: Array<Block> */) /*: Block */ {
    return {
      id: [advancedBlock.id].concat(...blocks.map((o) => o.id)).join('-'),
      name: assignImmutable({}, ...blocks.map((o) => o.name)),
      activity: this._mergeactivities(advancedBlock.activity, ...blocks.map((o) => o.activity)),
      conditions: assignImmutable(advancedBlock.conditions, ...blocks.map((o) => o.conditions)),
      actions: this._mergeActions(advancedBlock.actions, ...blocks.map((o) => o.actions)),
    }
  }

  _mergeactivities(root /*: string */, ...others /*: Array<string> */) /*: string */ {
    let result = [root, ...others].filter((a) => a !== 'Unset')
    return result.length > 0 ? result.reverse()[0] : 'Unset'
  }

  _mergeActions(root /*: object */, ...others /*: Array<object> */) /*: object */ {
    let result = assignImmutable(root, ...others)

    others.forEach((other) => {
      forIn(other, (valObject, key) => {
        switch (key) {
          case 'SetBorderColor':
          case 'SetTextColor':
          case 'SetBackgroundColor':
            if (valObject.function) {
              result[key] = {
                rgb: Color(root[key].rgb)
                  [valObject.function.toLowerCase()](valObject.val)
                  .rgb()
                  .object(),
                alpha: root[key].alpha,
              }
            }
            break
          case 'SetFontSize':
            if (valObject.function) {
              const val1 = root[key] ? root[key] : 32
              const val2 = valObject.function === 'Plus' ? valObject.val : -valObject.val
              result[key] = Math.min(Math.max(val1 + val2, 18), 45)
            }
            break
          case 'PlayAlertSound':
            delete result.PlayAlertSoundPositional
            delete result.CustomAlertSound
            break
          case 'PlayAlertSoundPositional':
            delete result.PlayAlertSound
            delete result.CustomAlertSound
            break
          case 'CustomAlertSound':
            delete result.PlayAlertSound
            delete result.PlayAlertSoundPositional
            break
        }
      })
    })

    return result
  }

  _emptyBlock(branchName /*: string */) /*: Block */ {
    return {
      id: '0000', // TODO: unique number
      name: createObject(branchName),
      activity: 'Unset',
      conditions: {},
      actions: {},
    }
  }
}
