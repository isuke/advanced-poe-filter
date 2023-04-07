import test from 'ava'

import Expander from '../src/expander.js'

test('expand : single section', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSound: { id: '1', volume: 300 },
      },
      branches: [],
    },
  ]

  const expected = [
    {
      name: 'Map Section',
      blocks: [
        {
          id: '0001',
          name: {},
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : multi section', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Hide Map Section',
      activity: 'Hide',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '<= 4',
      },
      actions: {},
      branches: [],
    },
    {
      id: '0001',
      name: 'Flask Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'] },
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSound: { id: '1', volume: 300 },
      },
      branches: [],
    },
    {
      id: '0001',
      name: 'Ignore Section',
      activity: 'Ignore',
      conditions: {
        Rarity: 'Rare',
      },
      actions: {},
      branches: [],
    },
  ]

  const expected = [
    {
      name: 'Hide Map Section',
      blocks: [
        {
          id: '0001',
          name: {},
          activity: 'Hide',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
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
          id: '0001',
          name: {},
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'] },
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single fork', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Unset',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSoundPositional: { id: '1', volume: 300 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Fork',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
                PlayAlertSound: { id: '2', volume: 300 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
            {
              id: '0004',
              name: 'Normal',
              activity: 'Unset',
              conditions: { Rarity: 'Normal' },
              actions: {},
              branches: [],
            },
            {
              id: '0005',
              name: 'Unique',
              activity: 'Ignore',
              conditions: { Rarity: 'Unique' },
              actions: {},
              branches: [],
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
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Rare',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSound: { id: '2', volume: 300 },
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
          },
        },
        {
          id: '0001-0003',
          name: { Rarity: 'Magic' },
          activity: 'Hide',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Magic',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0004',
          name: { Rarity: 'Normal' },
          activity: 'Unset',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Normal',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single fork with all ignore', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSoundPositional: { id: '1', volume: 300 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Fork',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Ignore',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
                PlayAlertSound: { id: '2', volume: 300 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Ignore',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
            {
              id: '0004',
              name: 'Normal',
              activity: 'Ignore',
              conditions: { Rarity: 'Normal' },
              actions: {},
              branches: [],
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
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single mixin', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSoundPositional: { id: '1', volume: 300 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
                PlayAlertSound: { id: '2', volume: 300 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
            {
              id: '0004',
              name: 'Normal',
              activity: 'Unset',
              conditions: { Rarity: 'Normal' },
              actions: {},
              branches: [],
            },
            {
              id: '0005',
              name: 'Unique',
              activity: 'Ignore',
              conditions: { Rarity: 'Unique' },
              actions: {},
              branches: [],
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
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Rare',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSound: { id: '2', volume: 300 },
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
          },
        },
        {
          id: '0001-0003',
          name: { Rarity: 'Magic' },
          activity: 'Hide',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Magic',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0004',
          name: { Rarity: 'Normal' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
            Rarity: 'Normal',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single mixin with all ignore', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSoundPositional: { id: '1', volume: 300 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Ignore',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
                PlayAlertSound: { id: '2', volume: 300 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Ignore',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
            {
              id: '0004',
              name: 'Normal',
              activity: 'Ignore',
              conditions: { Rarity: 'Normal' },
              actions: {},
              branches: [],
            },
            {
              id: '0005',
              name: 'Unique',
              activity: 'Ignore',
              conditions: { Rarity: 'Unique' },
              actions: {},
              branches: [],
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
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '> 3',
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            PlayAlertSoundPositional: { id: '1', volume: 300 },
          },
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : single mixin in ignore', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Ignore',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
        MapTier: '> 3',
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
        PlayAlertSoundPositional: { id: '1', volume: 300 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
                PlayAlertSound: { id: '2', volume: 300 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
            {
              id: '0004',
              name: 'Normal',
              activity: 'Unset',
              conditions: { Rarity: 'Normal' },
              actions: {},
              branches: [],
            },
            {
              id: '0005',
              name: 'Unique',
              activity: 'Ignore',
              conditions: { Rarity: 'Unique' },
              actions: {},
              branches: [],
            },
          ],
        },
      ],
    },
  ]

  const expected = []

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : multi mixin', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: { Class: { ope: '=', vals: ['Maps'] } },
      actions: {},
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: { SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 } },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {},
              branches: [],
            },
          ],
        },
        {
          name: 'Tier',
          type: 'Mixin',
          blocks: [
            {
              id: '0004',
              name: 'High Tier',
              activity: 'Show',
              conditions: { MapTier: '>= 11' },
              actions: { PlayAlertSound: { id: '1', volume: 300 } },
              branches: [],
            },
            {
              id: '0005',
              name: 'Middle Tier',
              activity: 'Show',
              conditions: { MapTier: '>= 6' },
              actions: { PlayAlertSound: { id: '2', volume: 300 } },
              branches: [],
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
          id: '0001-0002-0004',
          name: { Rarity: 'Rare', Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
            MapTier: '>= 11',
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0002-0005',
          name: { Rarity: 'Rare', Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
            MapTier: '>= 6',
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: '2', volume: 300 },
          },
        },
        {
          id: '0001-0002-0000',
          name: { Rarity: 'Rare', Tier: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
          },
        },

        // Rarity is 'Magic'
        {
          id: '0001-0003-0004',
          name: { Rarity: 'Magic', Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
            MapTier: '>= 11',
          },
          actions: {
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0003-0005',
          name: { Rarity: 'Magic', Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
            MapTier: '>= 6',
          },
          actions: {
            PlayAlertSound: { id: '2', volume: 300 },
          },
        },
        {
          id: '0001-0003-0000',
          name: { Rarity: 'Magic', Tier: undefined },
          activity: 'Hide',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
          },
          actions: {},
        },

        // Rarity is undefined
        {
          id: '0001-0000-0004',
          name: { Rarity: undefined, Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '>= 11',
          },
          actions: {
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0000-0005',
          name: { Rarity: undefined, Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            MapTier: '>= 6',
          },
          actions: {
            PlayAlertSound: { id: '2', volume: 300 },
          },
        },
        {
          id: '0001-0000-0000',
          name: { Rarity: undefined, Tier: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
          },
          actions: {},
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : nested mixin', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: { Class: { ope: '=', vals: ['Maps'] } },
      actions: {},
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: { SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 } },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Hide',
              conditions: { Rarity: 'Magic' },
              actions: {
                SetBackgroundColor: { rb: { r: 255, g: 10, b: 0 }, alpha: 100 },
              },
              branches: [
                {
                  name: 'Tier',
                  type: 'Mixin',
                  blocks: [
                    {
                      id: '0004',
                      name: 'High Tier',
                      activity: 'Show',
                      conditions: { MapTier: '>= 11' },
                      actions: { PlayAlertSound: { id: '1', volume: 300 } },
                      branches: [],
                    },
                    {
                      id: '0005',
                      name: 'Middle Tier',
                      activity: 'Show',
                      conditions: { MapTier: '>= 6' },
                      actions: { PlayAlertSound: { id: '2', volume: 300 } },
                      branches: [],
                    },
                  ],
                },
              ],
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
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
          },
        },

        // Rarity is 'Magic'
        {
          id: '0001-0003-0004',
          name: { Rarity: 'Magic', Tier: 'High Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
            MapTier: '>= 11',
          },
          actions: {
            SetBackgroundColor: { rb: { r: 255, g: 10, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: '1', volume: 300 },
          },
        },
        {
          id: '0001-0003-0005',
          name: { Rarity: 'Magic', Tier: 'Middle Tier' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
            MapTier: '>= 6',
          },
          actions: {
            SetBackgroundColor: { rb: { r: 255, g: 10, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: '2', volume: 300 },
          },
        },
        {
          id: '0001-0003-0000',
          name: { Rarity: 'Magic', Tier: undefined },
          activity: 'Hide',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
          },
          actions: {
            SetBackgroundColor: { rb: { r: 255, g: 10, b: 0 }, alpha: 100 },
          },
        },

        // Rarity is undefined
        {
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
          },
          actions: {},
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : color function', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
      },
      actions: {
        SetBorderColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
        SetTextColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
        SetBackgroundColor: { rgb: { r: 200, g: 100, b: 50 }, alpha: 123 },
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetBorderColor: { function: 'Negate', val: undefined },
                SetTextColor: { function: 'Grayscale', val: undefined },
                SetBackgroundColor: { function: 'Lighten', val: 0.3 },
              },
              branches: [],
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
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
          },
          actions: {
            SetBorderColor: { rgb: { r: 55, g: 155, b: 205 }, alpha: 123 },
            SetTextColor: { rgb: { r: 124.5, g: 124.5, b: 124.5 }, alpha: 123 },
            SetBackgroundColor: { rgb: { r: 218.00000000000003, g: 143.99999999999997, b: 106.99999999999996 }, alpha: 123 },
          },
        },
        {
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
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

  const expander = new Expander(advancedScriptObject)
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})

test('expand : fontSize function', (t) => {
  const advancedScriptObject = [
    {
      id: '0001',
      name: 'Map Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Maps'] },
      },
      actions: {
        SetFontSize: 36,
      },
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetFontSize: { function: 'Plus', val: 27 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Show',
              conditions: { Rarity: 'Magic' },
              actions: {
                SetFontSize: { function: 'Minus', val: 6 },
              },
              branches: [],
            },
          ],
        },
      ],
    },
    {
      id: '0001',
      name: 'Jewel Section',
      activity: 'Show',
      conditions: {
        Class: { ope: '=', vals: ['Jewels'] },
      },
      actions: {},
      branches: [
        {
          name: 'Rarity',
          type: 'Mixin',
          blocks: [
            {
              id: '0002',
              name: 'Rare',
              activity: 'Show',
              conditions: { Rarity: 'Rare' },
              actions: {
                SetFontSize: { function: 'Plus', val: 5 },
              },
              branches: [],
            },
            {
              id: '0003',
              name: 'Magic',
              activity: 'Show',
              conditions: { Rarity: 'Magic' },
              actions: {
                SetFontSize: { function: 'Minus', val: 28 },
              },
              branches: [],
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
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Rare',
          },
          actions: {
            SetFontSize: 45,
          },
        },
        {
          id: '0001-0003',
          name: { Rarity: 'Magic' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
            Rarity: 'Magic',
          },
          actions: {
            SetFontSize: 30,
          },
        },
        {
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Maps'] },
          },
          actions: {
            SetFontSize: 36,
          },
        },
      ],
    },
    {
      name: 'Jewel Section',
      blocks: [
        {
          id: '0001-0002',
          name: { Rarity: 'Rare' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Jewels'] },
            Rarity: 'Rare',
          },
          actions: {
            SetFontSize: 37,
          },
        },
        {
          id: '0001-0003',
          name: { Rarity: 'Magic' },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Jewels'] },
            Rarity: 'Magic',
          },
          actions: {
            SetFontSize: 18,
          },
        },
        {
          id: '0001-0000',
          name: { Rarity: undefined },
          activity: 'Show',
          conditions: {
            Class: { ope: '=', vals: ['Jewels'] },
          },
          actions: {},
        },
      ],
    },
  ]

  const expander = new Expander(advancedScriptObject)
  expander.options = { initialFontSize: 32 }
  const result = expander.expand(advancedScriptObject)

  t.deepEqual(result, expected)
})
