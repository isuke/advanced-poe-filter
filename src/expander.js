// @flow

import Color from 'color'

import { product, createObject, takeLastExist, assignImmutable, forIn } from '../src/utils'

/*::
type AdvancedBlock = {
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
  name: object,
  activity: string,
  conditions: object,
  actions: object,
}
*/

const expand = (advancedScriptObject /*: Array<AdvancedBlock> */) /*: Array<Section> */ => {
  return advancedScriptObject.map((advancedBlock /*: AdvancedBlock */) => _convertAdvancedBlockToSection(advancedBlock))
}

const _convertAdvancedBlockToSection = (advancedBlock /*: AdvancedBlock */) /*: Section */ => {
  if (advancedBlock.branches.length === 0) {
    return {
      name: advancedBlock.name,
      blocks: [
        {
          name: {},
          activity: advancedBlock.activity,
          conditions: advancedBlock.conditions,
          actions: advancedBlock.actions,
        },
      ],
    }
  } else {
    const producted /*: Array<Array<Block>> */ = product(...advancedBlock.branches.map((branch) => _convertBranchToBlocks(branch)))

    return {
      name: advancedBlock.name,
      blocks: producted.map((p) => _mergeBlocks(advancedBlock, ...p)),
    }
  }
}

const _convertBranchToBlocks = (branch /*: Branch */) /* Array<Block> */ => {
  const sections /*: Array<Section> */ = branch.blocks.map((advancedBlock) => _convertAdvancedBlockToSection(advancedBlock))

  let blocks /*: Array<Blocks> */ = sections.reduce((acc, section) => {
    const nameObject = createObject(branch.name, section.name)
    const blocks = section.blocks.map((block) => {
      return {
        name: assignImmutable(nameObject, block.name),
        activity: block.activity,
        conditions: block.conditions,
        actions: block.actions,
      }
    })
    return acc.concat(blocks)
  }, [])

  if (branch.type === 'Mixin') blocks = blocks.concat(_emptyBlock(branch.name))
  return blocks
}

const _mergeBlocks = (advancedBlock /*: advancedBlock */, ...blocks /*: Array<Block> */) /*: Block */ => {
  return {
    name: assignImmutable({}, ...blocks.map((o) => o.name)),
    activity: takeLastExist([advancedBlock.activity, ...blocks.map((o) => o.activity)]),
    conditions: assignImmutable(advancedBlock.conditions, ...blocks.map((o) => o.conditions)),
    actions: _mergeActions(advancedBlock.actions, ...blocks.map((o) => o.actions)),
  }
}

const _mergeActions = (root /*: object */, ...others /*: Array<object> */) /*: object */ => {
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

const _emptyBlock = (branchName /*: string */) /*: Block */ => {
  return {
    name: createObject(branchName),
    activity: undefined,
    conditions: {},
    actions: {},
  }
}

export default expand
