const test = require('ava')
const outdent = require('outdent')

const parser = require('../lib/parser')

test('parse : all actions and conditions', (t) => {
  const script = outdent`
    Show "Section1"
        Class          "Maps"
        BaseType       "Sacrificial Garb"
        Prophecy       "Foo"
        DropLevel      > 85
        ItemLevel      >= 70
        GemLevel       = 10
        StackSize      < 11
        MapTier        <= 12
        Quality        = 15
        LinkedSockets  = 6
        Sockets        = 5
        SocketGroup    RGB
        Rarity         = Rare
        ShaperItem     True
        ElderItem      False
        Corrupted      True
        Identified     True
        ShapedMap      True
        Height         > 1
        Width          > 2
        HasExplicitMod "Piyo"
        SetBorderColor           100 101 102
        SetTextColor             103 104 105
        SetBackgroundColor       106 107 108
        SetFontSize              30
        PlayAlertSound           1 300
        DisableDropSound         False
        CustomAlertSound         "C\\foobar\\sound.mp3"
        MinimapIcon              1 Red Circle
        PlayEffect               Red
    Show "Section2"
        Class          "Life Flasks" "Mana Flasks" "Hybrid Flasks"
        BaseType       "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
        Prophecy       "Foo" "Bar"
        SocketGroup    W
        Rarity         Rare
        HasExplicitMod "Piyo" "Piyo"
        SetBorderColor           100 101 102 200
        SetTextColor             103 104 105 201
        SetBackgroundColor       106 107 108 202
        PlayAlertSoundPositional ShAlchemy 200
        PlayEffect               Blue Temp
    Show "Section3"
        SetBorderColor           Negate()
        SetTextColor             Grayscale()
        SetBackgroundColor       Lighten(10%)
    Show "Section4"
        SetBorderColor           Darken(20%)
        SetTextColor             Whiten(31%)
        SetBackgroundColor       Blacken(100%)

   `

  const expected = [
    {
      name: 'Section1',
      activity: 'Show',
      conditions: {
        Class: ['Maps'],
        BaseType: ['Sacrificial Garb'],
        Prophecy: ['Foo'],
        DropLevel: '> 85',
        ItemLevel: '>= 70',
        GemLevel: '= 10',
        StackSize: '< 11',
        MapTier: '<= 12',
        Quality: '= 15',
        LinkedSockets: '= 6',
        Sockets: '= 5',
        SocketGroup: 'RGB',
        Rarity: '= Rare',
        ShaperItem: true,
        ElderItem: false,
        Corrupted: true,
        Identified: true,
        ShapedMap: true,
        Height: '> 1',
        Width: '> 2',
        HasExplicitMod: ['Piyo'],
      },
      actions: {
        SetBorderColor: { rgb: { r: 100, g: 101, b: 102 }, alpha: 255 },
        SetTextColor: { rgb: { r: 103, g: 104, b: 105 }, alpha: 255 },
        SetBackgroundColor: { rgb: { r: 106, g: 107, b: 108 }, alpha: 255 },
        SetFontSize: 30,
        PlayAlertSound: '1 300',
        DisableDropSound: false,
        CustomAlertSound: 'C\\foobar\\sound.mp3',
        MinimapIcon: '1 Red Circle',
        PlayEffect: 'Red',
      },
      mixins: [],
    },
    {
      name: 'Section2',
      activity: 'Show',
      conditions: {
        Class: ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
        BaseType: ['Two-Toned Boots', 'Spiked Gloves', 'Gripped Gloves', 'Fingerless Silk Gloves', 'Bone Helmet'],
        Prophecy: ['Foo', 'Bar'],
        SocketGroup: 'W',
        Rarity: 'Rare',
        HasExplicitMod: ['Piyo', 'Piyo'],
      },
      actions: {
        SetBorderColor: { rgb: { r: 100, g: 101, b: 102 }, alpha: 200 },
        SetTextColor: { rgb: { r: 103, g: 104, b: 105 }, alpha: 201 },
        SetBackgroundColor: { rgb: { r: 106, g: 107, b: 108 }, alpha: 202 },
        PlayAlertSoundPositional: 'ShAlchemy 200',
        PlayEffect: 'Blue Temp',
      },
      mixins: [],
    },
    {
      name: 'Section3',
      activity: 'Show',
      conditions: {},
      actions: {
        SetBorderColor: { function: 'Negate', val: undefined },
        SetTextColor: { function: 'Grayscale', val: undefined },
        SetBackgroundColor: { function: 'Lighten', val: 0.1 },
      },
      mixins: [],
    },
    {
      name: 'Section4',
      activity: 'Show',
      conditions: {},
      actions: {
        SetBorderColor: { function: 'Darken', val: 0.2 },
        SetTextColor: { function: 'Whiten', val: 0.31 },
        SetBackgroundColor: { function: 'Blacken', val: 1 },
      },
      mixins: [],
    },
  ]

  const result = parser.parse(script)

  t.deepEqual(result, expected)
})

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
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
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
      },
      actions: {
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
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
        SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
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
              actions: { SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 } },
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
              actions: { SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 } },
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
              actions: { SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 } },
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
