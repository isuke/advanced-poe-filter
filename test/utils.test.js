const test = require('ava')

const utils = require('../src/utils')

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

test('toUpperFirstChar', (t) => {
  const string = 'true'
  const expected = 'True'

  const result = utils.toUpperFirstChar(string)

  t.is(result, expected)
  t.is(string, 'true')
})
