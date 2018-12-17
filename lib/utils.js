const cloneDeep = require('lodash.clonedeep')

const product = (headArray, ...tailArraies) => {
  let result = []

  if (!headArray) {
    return result
  }

  headArray.forEach((headItem) => {
    const tailProduct = product(...tailArraies)

    if (tailProduct.length > 0) {
      tailProduct.forEach((tailProductItem) => {
        result.push([headItem].concat(tailProductItem))
      })
    } else {
      result.push([headItem])
    }
  })

  return result
}

const createObject = (key, val = undefined) => {
  let result = {}
  result[key] = val
  return result
}

const takeLastExist = (array) => {
  return array.filter((o) => o).reverse()[0]
}

const assignImmutable = (object, ...objects) => {
  return Object.assign(cloneDeep(object), ...objects)
}

module.exports = {
  product,
  createObject,
  takeLastExist,
  assignImmutable,
}
