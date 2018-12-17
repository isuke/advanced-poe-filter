const test = require('ava')
const outdent = require('outdent')

const parser = require('../dist/parser')

test('parse : single section', (t) => {
  const script = outdent`
    Show "Map Section"
        Class "Maps"
        MapTier > 3

        SetBorderColor 250 251 252
        PlayAlertSound 1 300

   `

  const expected = [
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

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

test('parse : multi section', (t) => {
  const script = outdent`
    Hide "Hide Map Section"
        Class "Maps"
        MapTier <= 4

    Show "Flask Section"
        Class "Life Flasks" "Mana Flasks" "Hybrid Flasks"
        MapTier > 3

        SetBorderColor 250 251 252
        PlayAlertSound 1 300

   `

  const expected = [
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

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

test('parse : single mixin', (t) => {
  const script = outdent`
    Show "Map Section"
        Class "Maps"
        MapTier > 3

        SetBorderColor 250 251 252
        PlayAlertSound 1 300

        Mixin "Rarity"
            Show "Rare"
                Rarity Rare
                SetBackgroundColor 255 0 0 100

            Hide "Magic"
                Rarity Magic

   `

  const expected = [
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

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

test('parse : multi mixin', (t) => {
  const script = outdent`
    Show "Map Section"
        Class "Maps"

        Mixin "Rarity"
            Show "Rare"
                Rarity Rare
                SetBackgroundColor 255 0 0 100

            Hide "Magic"
                Rarity Magic

        Mixin "Tier"
            Show "High Tier"
                MapTier >= 11
                PlayAlertSound  1 300

            Show "Middle Tier"
                MapTier >=  6
                PlayAlertSound 2 300

   `

  const expected = [
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

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

test('parse : nested mixin', (t) => {
  const script = outdent`
    Show "Map Section"
        Class "Maps"

        Mixin "Rarity"
            Show "Rare"
                Rarity Rare
                SetBackgroundColor 255 0 0 100

            Hide "Magic"
                Rarity Magic

                Mixin "Tier"
                    Show "High Tier"
                        MapTier >= 11
                        PlayAlertSound  1 300

                    Show "Middle Tier"
                        MapTier >=  6
                        PlayAlertSound 2 300

   `

  const expected = [
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
              mixins: [
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
          ],
        },
      ],
    },
  ]

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

test('parse : comment', (t) => {
  const script = outdent`
    # This is Comment
    # This is Comment
    Show "Map Section"
        Class "Maps"
        MapTier > 3

        # This is "Comment"
        SetBorderColor 250 251 252
        PlayAlertSound 1 300

   `

  const expected = [
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

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})
