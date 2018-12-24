const test = require('ava')
const outdent = require('outdent')

const generator = require('../lib/generator')

test('generate : single section', (t) => {
  const scriptObject = [
    {
      name: 'Map Section',
      blocks: [
        {
          name: {},
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '> 3',
            Identified: false,
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class "Maps"
    MapTier > 3
    Identified False
    SetBorderColor 250 251 252
    PlayAlertSound 1 300


  `

  const result = generator.generate(scriptObject)

  t.is(result, expected)
})

test('generate : multi section', (t) => {
  const scriptObject = [
    {
      name: 'Hide Map Section',
      blocks: [
        {
          name: {},
          activity: 'Hide',
          conditions: {
            Class: ['Maps'],
            MapTier: '<= 4',
          },
          actions: {},
        },
      ],
    },
    {
      name: 'Flask Section',
      blocks: [
        {
          name: {},
          activity: 'Show',
          conditions: {
            Class: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
# Hide Map Section                                                             #
################################################################################
Hide
    Class "Maps"
    MapTier <= 4
    DisableDropSound True


################################################################################
# Flask Section                                                                #
################################################################################
Show
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks"
    SetBorderColor 250 251 252
    PlayAlertSound 1 300


  `

  const result = generator.generate(scriptObject)

  t.is(result, expected)
})

test('generate : multi block', (t) => {
  const scriptObject = [
    {
      name: 'Map Section',
      blocks: [
        // Rarity is 'Rare'
        {
          name: { Rarity: 'Rare', Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Rare',
            MapTier: '>= 11',
          },
          actions: {
            SetBackgroundColor: '255 0 0 100',
            PlayAlertSound: '1 300',
          },
        },
        {
          name: { Rarity: 'Rare', Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Rare',
            MapTier: '>= 6',
          },
          actions: {
            SetBackgroundColor: '255 0 0 100',
            PlayAlertSound: '2 300',
          },
        },
        {
          name: { Rarity: 'Rare', Tier: undefined },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Rare',
          },
          actions: {
            SetBackgroundColor: '255 0 0 100',
          },
        },

        // Rarity is 'Magic'
        {
          name: { Rarity: 'Magic', Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Magic',
            MapTier: '>= 11',
          },
          actions: {
            PlayAlertSound: '1 300',
          },
        },
        {
          name: { Rarity: 'Magic', Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Magic',
            MapTier: '>= 6',
          },
          actions: {
            PlayAlertSound: '2 300',
          },
        },
        {
          name: { Rarity: 'Magic', Tier: undefined },
          activity: 'Hide',
          conditions: {
            Class: ['Maps'],
            Rarity: 'Magic',
          },
          actions: {},
        },

        // Rarity is undefined
        {
          name: { Rarity: undefined, Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '>= 11',
          },
          actions: {
            PlayAlertSound: '1 300',
          },
        },
        {
          name: { Rarity: undefined, Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '>= 6',
          },
          actions: {
            PlayAlertSound: '2 300',
          },
        },
        {
          name: { Rarity: undefined, Tier: undefined },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
          },
          actions: {},
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare" - Tier is "High Tier"
Show
    Class "Maps"
    Rarity Rare
    MapTier >= 11
    SetBackgroundColor 255 0 0 100
    PlayAlertSound 1 300

# Rarity is "Rare" - Tier is "Middle Tier"
Show
    Class "Maps"
    Rarity Rare
    MapTier >= 6
    SetBackgroundColor 255 0 0 100
    PlayAlertSound 2 300

# Rarity is "Rare" - Tier is Any
Show
    Class "Maps"
    Rarity Rare
    SetBackgroundColor 255 0 0 100

# Rarity is "Magic" - Tier is "High Tier"
Show
    Class "Maps"
    Rarity Magic
    MapTier >= 11
    PlayAlertSound 1 300

# Rarity is "Magic" - Tier is "Middle Tier"
Show
    Class "Maps"
    Rarity Magic
    MapTier >= 6
    PlayAlertSound 2 300

# Rarity is "Magic" - Tier is Any
Hide
    Class "Maps"
    Rarity Magic
    DisableDropSound True

# Rarity is Any - Tier is "High Tier"
Show
    Class "Maps"
    MapTier >= 11
    PlayAlertSound 1 300

# Rarity is Any - Tier is "Middle Tier"
Show
    Class "Maps"
    MapTier >= 6
    PlayAlertSound 2 300

# Rarity is Any - Tier is Any
Show
    Class "Maps"


  `

  const result = generator.generate(scriptObject)

  t.is(result, expected)
})