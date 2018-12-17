const utils = require('../lib/utils')

const expand = (advancedScriptObject) => {
  return advancedScriptObject.map((asvancedSectionObject) => {
    return {
      name: asvancedSectionObject.name,
      blocks: _createBlocks(asvancedSectionObject),
    }
  })
}

const _createBlocks = (asvancedSectionObject) => {
  if (asvancedSectionObject.mixins.length > 0) {
    return utils.product(..._adjustMiixns(asvancedSectionObject.mixins)).map((p) => {
      return _mergeScriptObject(asvancedSectionObject, ...p)
    })
  } else {
    return [
      {
        name: {},
        activity: asvancedSectionObject.activity,
        conditions: asvancedSectionObject.conditions,
        actions: asvancedSectionObject.actions,
      },
    ]
  }
}

const _adjustMiixns = (mixins) => {
  return mixins.map((mixin) => {
    let temp = mixin.blocks.map((block) => {
      return {
        name: utils.createObject(mixin.name, block.name),
        activity: block.activity,
        conditions: block.conditions,
        actions: block.actions,
      }
    })

    temp.push(_emptyBlock(mixin.name))

    return temp
  })
}

const _mergeScriptObject = (rootObject, ...others) => {
  return {
    name: utils.assignImmutable({}, ...others.map((o) => o.name)),
    activity: utils.takeLastExist([rootObject.activity, ...others.map((o) => o.activity)]),
    conditions: utils.assignImmutable(rootObject.conditions, ...others.map((o) => o.conditions)),
    actions: utils.assignImmutable(rootObject.actions, ...others.map((o) => o.actions)),
  }
}

const _emptyBlock = (mixinName) => {
  return {
    name: utils.createObject(mixinName),
    activity: undefined,
    conditions: {},
    actions: {},
  }
}

module.exports = {
  expand,
}
