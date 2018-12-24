const test = require('ava')
const outdent = require('outdent')

const prepender = require('../lib/prepender')

test('prepend : nothing anyone', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const expected = outdent`
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const result = prepender.prepend(advancedScriptText)

  t.is(result, expected)
})

test('prepend : remove comments', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    # This is Comment
    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const expected = outdent`
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const result = prepender.prepend(advancedScriptText)

  t.is(result, expected)
})

test('prepend : simple value', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" Var(myClass1) Var(myClass2)
    MapTier > Var(myMapTier)
    Identified Var(myIdentified)

    SetBorderColor Var(myBorderColor)
    PlayAlertSound Var(myPlayAlertSoundId) 300

   `

  const variables = {
    myClass1: 'Hybrid Flasks',
    myClass2: 'Utility Flasks',
    myMapTier: 3,
    myIdentified: false,
    myBorderColor: '250 251 252',
    myPlayAlertSoundId: 1,
  }

  const expected = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const result = prepender.prepend(advancedScriptText, variables)

  t.is(result, expected)
})

test('prepend : complex value', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class Var(myClass) "Utility Flasks"
    MapTier Var(myMapTier)

    PlayAlertSound Var(myPlayAlertSound)

   `

  const variables = {
    myClass: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
    myMapTier: '> 3',
    mySetBorderColor: '250 251 252',
    myPlayAlertSound: '1 300',
  }

  const expected = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    MapTier > 3

    PlayAlertSound 1 300

  `

  const result = prepender.prepend(advancedScriptText, variables)

  t.is(result, expected)
})