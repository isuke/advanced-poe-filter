import cloneDeep from 'lodash.clonedeep'

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

const assignImmutable = (object, ...objects) => {
  return Object.assign(cloneDeep(object), ...objects)
}

const forIn = (object, callback) => {
  Object.keys(object).forEach((key) => {
    callback(object[key], key)
  })
}

const mapObject = (object, callback) => {
  let result = []
  forIn(object, (val, key) => {
    result.push(callback(val, key))
  })
  return result
}

const mapVals = (object, callback) => {
  let result = {}
  forIn(object, (val, key) => {
    result[key] = callback(val, key)
  })
  return result
}

const toUpperFirstChar = (string) => {
  const s = string.toString()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export { product, createObject, assignImmutable, forIn, mapObject, mapVals, toUpperFirstChar }
