import test from 'ava'
import outdent from 'outdent'

import Prepender from '../src/prepender'

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

  const prepender = new Prepender(advancedScriptText)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : simple variables of value', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class Var("My Class1") Var("My Class2") Var("My Class3")
    MapTier > Var("My Map Tier")
    Identified Var("My Identified")

    SetBorderColor Var("My BorderColor")
    PlayAlertSound Var("My PlayAlertSoundId") 300

   `

  const variables = {
    'My Class1': 'Hybrid Flasks',
    'My Class2': 'Utility Flasks',
    'My Class3': ['Life Flasks', 'Mana Flasks'],
    'My Map Tier': 3,
    'My Identified': false,
    'My BorderColor': '250 251 252',
    'My PlayAlertSoundId': 1,
  }

  const expected = outdent`
Show "Map Section"
    Class "Hybrid Flasks" "Utility Flasks" "Life Flasks" "Mana Flasks"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const prepender = new Prepender(advancedScriptText, variables)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : comment out variables', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class Var("My Class1") Var("My Class2") Var("My Class3")
    # MapTier > Var("My Map Tier")

   `

  const variables = {
    'My Class1': 'Hybrid Flasks',
    'My Class2': 'Utility Flasks',
    'My Class3': ['Life Flasks', 'Mana Flasks'],
  }

  const expected = outdent`
Show "Map Section"
    Class "Hybrid Flasks" "Utility Flasks" "Life Flasks" "Mana Flasks"
    # MapTier > Var("My Map Tier")

  `

  const prepender = new Prepender(advancedScriptText, variables)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : simple variables of activity', (t) => {
  const advancedScriptText = outdent`
Var("My Activity") "Map Section"
    Class "Map"

   `

  const variables = {
    'My Activity': 'Show',
  }

  const expected = outdent`
Show "Map Section"
    Class "Map"

  `

  const prepender = new Prepender(advancedScriptText, variables)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : simple variables of action', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Map"
    Var("My Action") 1 300

   `

  const variables = {
    'My Action': 'PlayAlertSound',
  }

  const expected = outdent`
Show "Map Section"
    Class "Map"
    PlayAlertSound 1 300

  `

  const prepender = new Prepender(advancedScriptText, variables)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : nested variables', (t) => {
  const advancedScriptText = outdent`
Show "Flask Section"
    Class Var("Flask1")
    ItemLevel Var("MyItemLevel")

   `

  const variables = {
    MyItemLevel: '#ItemLevel',
    ItemLevel: 1,
    Flask1: ['#Flask2', 'Utility Flask'],
    Flask2: ['Life Flask', 'Mana Flask', 'Hybrid Flask'],
  }

  const expected = outdent`
Show "Flask Section"
    Class "Life Flask" "Mana Flask" "Hybrid Flask" "Utility Flask"
    ItemLevel 1

  `

  const prepender = new Prepender(advancedScriptText, variables)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : variable not found', (t) => {
  const advancedScriptText = outdent`
Show "Flask Section"
    Class Var("Flask1")
    ItemLevel Var("MyItemLevelx")

   `

  const variables = {
    Flask1: ['Life Flask', 'Mana Flask', 'Hybrid Flask'],
    MyItemLevel: 10,
  }

  const prepender = new Prepender(advancedScriptText, variables)

  t.throws(() => prepender.prepend(), "'MyItemLevelx' is not found")
})

test('prepend : infinity loop variables', (t) => {
  const advancedScriptText = outdent`
Show "Flask Section"
    Class Var("Flask1")
    ItemLevel Var("MyItemLevel")

   `

  const variables = {
    Flask1: ['Life Flask', 'Mana Flask', 'Hybrid Flask'],
    MyItemLevel1: '#MyItemLevel2',
    MyItemLevel2: '#MyItemLevel1',
  }

  const prepender = new Prepender(advancedScriptText, variables)

  t.throws(() => prepender.prepend(), 'nest is too deep')
})

test('prepend : simple props of value', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" Prop("My Class1") Prop("My Class2")
    MapTier > Prop("My MapTier")
    Identified Prop("My Identified")

    SetBorderColor Prop("My BorderColor")
    PlayAlertSound Prop("My Play Alert Sound Id") 300

   `

  const props = {
    'My Class1': 'Hybrid Flasks',
    'My Class2': 'Utility Flasks',
    'My MapTier': 3,
    'My Identified': false,
    'My BorderColor': '250 251 252',
    'My Play Alert Sound Id': 1,
  }

  const expected = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const prepender = new Prepender(advancedScriptText, {}, props)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : simple props of activity', (t) => {
  const advancedScriptText = outdent`
Prop("My Activity") "Map Section"
    Class "Map"

   `

  const props = {
    'My Activity': 'Show',
  }

  const expected = outdent`
Show "Map Section"
    Class "Map"

  `

  const prepender = new Prepender(advancedScriptText, {}, props)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : simple props of action', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Map"
    Prop("My Action") 1 300

   `

  const props = {
    'My Action': 'PlayAlertSound',
  }

  const expected = outdent`
Show "Map Section"
    Class "Map"
    PlayAlertSound 1 300

  `

  const prepender = new Prepender(advancedScriptText, {}, props)
  const result = prepender.prepend()

  t.is(result, expected)
})

test('prepend : combined variables and props', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Map"
    MapTier > Prop("My Map Tier")

   `

  const variables = {
    'High Map Tier': 11,
  }

  const props = {
    'My Map Tier': 'Var("High Map Tier")',
  }

  const expected = outdent`
Show "Map Section"
    Class "Map"
    MapTier > 11

  `

  const prepender = new Prepender(advancedScriptText, variables, props)
  const result = prepender.prepend()

  t.is(result, expected)
})
