const test = require('ava')

const expander = require('../lib/expander')

test('expand : single section', (t) => {
  const advancedScriptObject = [
    {
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: ['Maps'],
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: '250 251 252',
        PlayAlertSound: '1 300',
      },
      mixins: [],
    },
  ]

  const expected = [
    {
      name: 'Map Section',
      blocks: [
        {
          name: {},
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
      ],
    },
  ]

  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : multi section', (t) => {
  const advancedScriptObject = [
    {
      name: 'Hide Map Section',
      activity: 'Hide',
      conditions: {
        Class: ['Maps'],
        MapTier: '<= 4',
      },
      actions: {},
      mixins: [],
    },
    {
      name: 'Flask Section',
      activity: 'Show',
      conditions: {
        Class: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: '250 251 252',
        PlayAlertSound: '1 300',
      },
      mixins: [],
    },
  ]

  const expected = [
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
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
      ],
    },
  ]

  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single mixin', (t) => {
  const advancedScriptObject = [
    {
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: ['Maps'],
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: '250 251 252',
        PlayAlertSound: '1 300',
      },
      mixins: [
        {
          name: 'Rarity',
          blocks: [
            {
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: { SetBackgroundColor: '255 0 0 100' },
              mixins: [],
            },
            {
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              mixins: [],
            },
          ],
        },
      ],
    },
  ]

  const expected = [
    {
      name: 'Map Section',
      blocks: [
        {
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '> 3',
            Rarity: 'Rare',
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
            SetBackgroundColor: '255 0 0 100',
          },
        },
        {
          name: { Rarity: 'Magic' },
          activity: 'Hide',
          conditions: {
            Class: ['Maps'],
            MapTier: '> 3',
            Rarity: 'Magic',
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
        {
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: '250 251 252',
            PlayAlertSound: '1 300',
          },
        },
      ],
    },
  ]

  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : multi mixin', (t) => {
  const advancedScriptObject = [
    {
      name: 'Map Section',
      activity: 'Show',
      conditions: { Class: ['Maps'] },
      actions: {},
      mixins: [
        {
          name: 'Rarity',
          blocks: [
            {
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: { SetBackgroundColor: '255 0 0 100' },
              mixins: [],
            },
            {
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              mixins: [],
            },
          ],
        },
        {
          name: 'Tier',
          blocks: [
            {
              name: 'High Tier',
              activity: 'Show',
              conditions: { MapTier: '>= 11' },
              actions: { PlayAlertSound: '1 300' },
              mixins: [],
            },
            {
              name: 'Middle Tier',
              activity: 'Show',
              conditions: { MapTier: '>= 6' },
              actions: { PlayAlertSound: '2 300' },
              mixins: [],
            },
          ],
        },
      ],
    },
  ]

  const expected = [
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

  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})
