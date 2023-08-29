// @flow

//$FlowFixMe
import Color from "color"

import { product, compact, createObject, assignImmutable, forIn } from "../src/utils.js"

/*::
type AdvancedBlock = {
  id: string,
  name: string,
  activity: string,
  conditions: Object,
  actions: Object,
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
  name: Object,
  activity: string,
  conditions: Object,
  actions: Object,
}
*/

export default class {
  /*:: $advancedScriptObject: Array<AdvancedBlock> */
  /*:: $variables: Object */
  /*:: $props: Object */
  /*:: $options: Object */

  constructor(advancedScriptObject /*: Array<AdvancedBlock> */, variables /*: Object */ = {}, props /*: Object */ = {}, options /*: Object */ = {}) {
    this.$advancedScriptObject = advancedScriptObject
    this.$variables = variables
    this.$props = props
    this.$options = options
  }

  set advancedScriptObject(val /*: Array<AdvancedBlock> */) {
    this.$advancedScriptObject = val
  }

  set variables(val /*: Object */) {
    this.$variables = val
  }

  set props(val /*: Object */) {
    this.$props = val
  }

  set options(val /*: Object */) {
    this.$options = val
  }

  expand() /*: Array<Section> */ {
    return compact(this.$advancedScriptObject.map((advancedBlock /*: AdvancedBlock */) => this._convertAdvancedBlockToSection(advancedBlock)))
  }

  _convertAdvancedBlockToSection(advancedBlock /*: AdvancedBlock */) /*: ?Section */ {
    if (advancedBlock.activity === "Ignore") return undefined

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

  _convertBranchToBlocks(branch /*: Branch */) /*: Array<Block> */ {
    const sections /*: Array<Section> */ = compact(branch.blocks.map((advancedBlock) => this._convertAdvancedBlockToSection(advancedBlock)))

    let blocks /*: Array<Block> */ = sections.reduce((acc, section) => {
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

    if (branch.type === "Mixin") blocks = blocks.concat(this._emptyBlock(branch.name))

    // blocks length is zero when all block is ignore.
    if (blocks.length === 0) blocks = [this._emptyBlock(branch.name)]

    return blocks
  }

  _mergeBlocks(advancedBlock /*: AdvancedBlock */, ...blocks /*: Array<Block> */) /*: Block */ {
    return {
      id: [advancedBlock.id].concat(...blocks.map((o) => o.id)).join("-"),
      name: assignImmutable({}, ...blocks.map((o) => o.name)),
      activity: this._mergeActivities(advancedBlock.activity, ...blocks.map((o) => o.activity)),
      conditions: assignImmutable(advancedBlock.conditions, ...blocks.map((o) => o.conditions)),
      actions: this._mergeActions(advancedBlock.actions, ...blocks.map((o) => o.actions)),
    }
  }

  _mergeActivities(root /*: string */, ...others /*: Array<string> */) /*: string */ {
    let result = [root, ...others].filter((a) => a !== "Unset")
    return result.length > 0 ? result.reverse()[0] : "Unset"
  }

  _mergeActions(root /*: Object */, ...others /*: Array<Object> */) /*: Object */ {
    let result = [root, ...others].reduce((acc /*: Object */, current /*: Object */) => {
      if (
        /* eslint-disable no-prototype-builtins */
        current.hasOwnProperty("PlayAlertSoundPositional") ||
        current.hasOwnProperty("PlayAlertSound") ||
        current.hasOwnProperty("CustomAlertSound")
        /* eslint-enable */
      ) {
        delete acc.PlayAlertSoundPositional
        delete acc.PlayAlertSound
        delete acc.CustomAlertSound
      }

      return assignImmutable(acc, current)
    }, {})

    others.forEach((other) => {
      forIn(other, (valObject, key) => {
        switch (key) {
          case "SetBorderColor":
          case "SetTextColor":
          case "SetBackgroundColor":
            if (valObject.function) {
              result[key] = {
                rgb: Color(root[key].rgb)[valObject.function.toLowerCase()](valObject.val).rgb().object(),
                alpha: root[key].alpha,
              }
            }
            break
          case "SetFontSize":
            if (valObject.function) {
              const val1 = root[key] ? root[key] : this.$options.initialFontSize
              const val2 = valObject.function === "Plus" ? valObject.val : -valObject.val
              result[key] = Math.min(Math.max(val1 + val2, 18), 45)
            }
            break
        }
      })
    })

    return result
  }

  _emptyBlock(branchName /*: string */) /*: Block */ {
    return {
      id: "0000", // TODO: unique number
      name: createObject(branchName),
      activity: "Unset",
      conditions: {},
      actions: {},
    }
  }
}
