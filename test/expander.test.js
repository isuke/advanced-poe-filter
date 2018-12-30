const test = require('ava')

const expander = require('../src/expander')

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

test('expand : color function', (t) => {
  const advancedScriptObject = [
    {
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: ['Maps'],
      },
      actions: {
        SetBorderColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
        SetTextColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
        SetBackgroundColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
      },
      mixins: [
        {
          name: 'Rarity',
          blocks: [
            {
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBorderColor: { function: 'Negate', val: undefined },
                SetTextColor: { function: 'Grayscale', val: undefined },
                SetBackgroundColor: { function: 'Lighten', val: 0.3 },
              },
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
            Rarity: 'Rare',
          },
          actions: {
            SetBorderColor: { rgb: { r: 55, g: 155, b: 205 }, alpha: 123 },
            SetTextColor: { rgb: { r: 124.5, g: 124.5, b: 124.5 }, alpha: 123 },
            SetBackgroundColor: { rgb: { r: 218.00000000000003, g: 143.99999999999997, b: 106.99999999999996 }, alpha: 123 },
          },
        },
        {
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: ['Maps'],
          },
          actions: {
            SetBorderColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
            SetTextColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
            SetBackgroundColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
          },
        },
      ],
    },
  ]

  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})
