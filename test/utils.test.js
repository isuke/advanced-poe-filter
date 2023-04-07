import test from 'ava'

import * as utils from '../src/utils.js'

test('product : empty array', (t) => {
  const result = utils.product([])

  const expected = []

  t.deepEqual(result, expected)
})

test('product : single array', (t) => {
  const result = utils.product([1, 2])

  const expected = [[1], [2]]

  t.deepEqual(result, expected)
})

test('product : multi array', (t) => {
  const result = utils.product([1, 2], ['a', 'b'], ['x', 'y', 'z'])

  const expected = [
    [1, 'a', 'x'],
    [1, 'a', 'y'],
    [1, 'a', 'z'],
    [1, 'b', 'x'],
    [1, 'b', 'y'],
    [1, 'b', 'z'],
    [2, 'a', 'x'],
    [2, 'a', 'y'],
    [2, 'a', 'z'],
    [2, 'b', 'x'],
    [2, 'b', 'y'],
    [2, 'b', 'z'],
  ]

  t.deepEqual(result, expected)
})

test('compact', (t) => {
  const result = utils.compact(['hoge', 0, false, null, NaN, undefined, ''])

  const expected = ['hoge']

  t.deepEqual(result, expected)
})

test('assignImmutable', (t) => {
  const obj1 = { a: 'A' }
  const obj2 = { b: 'B' }
  const obj3 = { c: 'C' }
  const expected = { a: 'A', b: 'B', c: 'C' }

  const result = utils.assignImmutable(obj1, obj2, obj3)

  t.deepEqual(result, expected)
  t.deepEqual(obj1, { a: 'A' })
  t.deepEqual(obj2, { b: 'B' })
  t.deepEqual(obj3, { c: 'C' })
})

test('toUpperFirstChar', (t) => {
  const string = 'true'
  const expected = 'True'

  const result = utils.toUpperFirstChar(string)

  t.is(result, expected)
  t.is(string, 'true')
})
