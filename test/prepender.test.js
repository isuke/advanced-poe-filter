import test from 'ava'
import outdent from 'outdent'

import prepend from '../src/prepender'

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

  const result = prepend(advancedScriptText)

  t.is(result, expected)
})

test('prepend : simple variables', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" Var("My Class1") Var("My Class2")
    MapTier > Var("My Map Tier")
    Identified Var("My Identified")

    SetBorderColor Var("My BorderColor")
    PlayAlertSound Var("My PlayAlertSoundId") 300

   `

  const variables = {
    'My Class1': 'Hybrid Flasks',
    'My Class2': 'Utility Flasks',
    'My Map Tier': 3,
    'My Identified': false,
    'My BorderColor': '250 251 252',
    'My PlayAlertSoundId': 1,
  }

  const expected = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    MapTier > 3
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

  `

  const result = prepend(advancedScriptText, variables)

  t.is(result, expected)
})

test('prepend : complex variables', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class Var("My Class") "Utility Flasks"
    MapTier Var("My Map Tier")

    PlayAlertSound Var("My Play Alert Sound")

   `

  const variables = {
    'My Class': ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
    'My Map Tier': '> 3',
    'My Play Alert Sound': '1 300',
  }

  const expected = outdent`
Show "Map Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    MapTier > 3

    PlayAlertSound 1 300

  `

  const result = prepend(advancedScriptText, variables)

  t.is(result, expected)
})

test('prepend : simple props', (t) => {
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

  const result = prepend(advancedScriptText, {}, props)

  t.is(result, expected)
})
