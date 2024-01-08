import test from "ava"
import outdent from "outdent"

import Generator from "../src/generator.js"

test("generate : single section", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">", val: 3 },
            Identified: false,
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 125.5, b: 106.99999999999996 }, alpha: 255 },
            PlayAlertSound: { id: "1", volume: 300 },
            MinimapIcon: { size: "Large", color: "Red", shape: "Circle" },
            PlayEffect: { color: "Blue", temp: true },
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class = "Maps"
    MapTier > 3
    Identified False
    SetBorderColor 250 126 107 255
    MinimapIcon 0 Red Circle
    PlayEffect Blue Temp
    PlayAlertSound 1 300


  `

  const generator = new Generator(scriptObject, "9.8.7")
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : single section with scriptName and filterInfo", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">", val: 3 },
            Identified: false,
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 125.5, b: 106.99999999999996 }, alpha: 255 },
            PlayAlertSound: { id: "1", volume: 300 },
            MinimapIcon: { size: "Large", color: "Red", shape: "Circle" },
            PlayEffect: { color: "Blue", temp: true },
          },
        },
      ],
    },
  ]

  const scriptName = "T1"
  const filterInfo = { name: "My Filter", version: "3.4.5" }

  const expected = outdent`
################################################################################
#                                                                              #
# My Filter - T1 - (Ver: 3.4.5)                                                #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class = "Maps"
    MapTier > 3
    Identified False
    SetBorderColor 250 126 107 255
    MinimapIcon 0 Red Circle
    PlayEffect Blue Temp
    PlayAlertSound 1 300


  `

  const generator = new Generator(scriptObject, "9.8.7", scriptName, filterInfo)
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : single unset section", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Unset",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">", val: 3 },
            Identified: false,
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 125.5, b: 106.99999999999996 }, alpha: 255 },
            PlayAlertSound: { id: "1", volume: 300 },
            MinimapIcon: { size: "Large", color: "Red", shape: "Circle" },
            PlayEffect: { color: "Blue", temp: true },
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Unset


  `

  const generator = new Generator(scriptObject, "9.8.7")
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : single section with 'addDisableDropSoundToHideBlock' option", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Hide",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">", val: 3 },
            Identified: false,
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 125.5, b: 106.99999999999996 }, alpha: 255 },
            PlayAlertSound: { id: "1", volume: 300 },
            MinimapIcon: { size: "Large", color: "Red", shape: "Circle" },
            PlayEffect: { color: "Blue", temp: true },
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Hide
    Class = "Maps"
    MapTier > 3
    Identified False
    SetBorderColor 250 126 107 255
    DisableDropSound


  `

  const generator = new Generator(scriptObject, "9.8.7", "", {}, { addDisableDropSoundToHideBlock: true })
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : single section with 'initialFontSize' option", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">", val: 3 },
            Identified: false,
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 125.5, b: 106.99999999999996 }, alpha: 255 },
            PlayAlertSound: { id: "1", volume: 300 },
            MinimapIcon: { size: "Large", color: "Red", shape: "Circle" },
            PlayEffect: { color: "Blue", temp: true },
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class = "Maps"
    MapTier > 3
    Identified False
    SetFontSize 38
    SetBorderColor 250 126 107 255
    MinimapIcon 0 Red Circle
    PlayEffect Blue Temp
    PlayAlertSound 1 300


  `

  const generator = new Generator(scriptObject, "9.8.7", "", {}, { initialFontSize: 38 })
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : multi section", (t) => {
  const scriptObject = [
    {
      name: "Hide Map Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Hide",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: "<=", val: 4 },
          },
          actions: {
            SetFontSize: 38,
            PlayAlertSound: { id: 1, volume: 300 },
          },
        },
      ],
    },
    {
      name: "Flask Section",
      blocks: [
        {
          id: "0001",
          name: {},
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Life Flasks", "Mana Flasks", "Hybrid Flasks"] },
          },
          actions: {
            SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
            CustomAlertSound: { filePath: "./Flask.wav", volume: 150 },
          },
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Hide Map Section                                                             #
################################################################################
Hide
    Class = "Maps"
    MapTier <= 4
    SetFontSize 38


################################################################################
# Flask Section                                                                #
################################################################################
Show
    Class = "Life Flasks" "Mana Flasks" "Hybrid Flasks"
    SetBorderColor 250 251 252 255
    CustomAlertSound "./Flask.wav" 150


  `

  const generator = new Generator(scriptObject, "9.8.7")
  const result = generator.generate()

  t.is(result, expected)
})

test("generate : multi block", (t) => {
  const scriptObject = [
    {
      name: "Map Section",
      blocks: [
        // Rarity is 'Rare'
        {
          id: "0001-0002-0003",
          name: { Rarity: "Rare", Tier: "High Tier" },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Rare" },
            MapTier: { ope: ">=", val: 11 },
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: "1", volume: 300 },
          },
        },
        {
          id: "0001-0002-0004",
          name: { Rarity: "Rare", Tier: "Middle Tier" },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Rare" },
            MapTier: { ope: ">=", val: 6 },
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
            PlayAlertSound: { id: "2", volume: 300 },
          },
        },
        {
          id: "0001-0002-0000",
          name: { Rarity: "Rare", Tier: undefined },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Rare" },
          },
          actions: {
            SetBackgroundColor: { rgb: { r: 255, g: 0, b: 0 }, alpha: 100 },
          },
        },

        // Rarity is 'Magic'
        {
          id: "0001-0005-0003",
          name: { Rarity: "Magic", Tier: "High Tier" },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Magic" },
            MapTier: { ope: ">=", val: 11 },
          },
          actions: {
            PlayAlertSound: { id: "1", volume: 300 },
          },
        },
        {
          id: "0001-0005-0004",
          name: { Rarity: "Magic", Tier: "Middle Tier" },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Magic" },
            MapTier: { ope: ">=", val: 6 },
          },
          actions: {
            PlayAlertSound: { id: "2", volume: 300 },
          },
        },
        {
          id: "0001-0005-0000",
          name: { Rarity: "Magic", Tier: undefined },
          activity: "Hide",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            Rarity: { ope: "=", val: "Magic" },
          },
          actions: {},
        },

        // Rarity is undefined
        {
          id: "0001-0000-0003",
          name: { Rarity: undefined, Tier: "High Tier" },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">=", val: 11 },
          },
          actions: {
            PlayAlertSound: { id: "1", volume: 300 },
          },
        },
        {
          id: "0001-0000-0004",
          name: { Rarity: undefined, Tier: "Middle Tier" },
          activity: "Unset",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
            MapTier: { ope: ">=", val: 6 },
          },
          actions: {
            PlayAlertSound: { id: "2", volume: 300 },
          },
        },
        {
          id: "0001-0000-0000",
          name: { Rarity: undefined, Tier: undefined },
          activity: "Show",
          conditions: {
            Class: { ope: "=", vals: ["Maps"] },
          },
          actions: {},
        },
      ],
    },
  ]

  const expected = outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 9.8.7)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare" - Tier is "High Tier"
Show
    Class = "Maps"
    Rarity = Rare
    MapTier >= 11
    SetBackgroundColor 255 0 0 100
    PlayAlertSound 1 300

# Rarity is "Rare" - Tier is "Middle Tier"
Show
    Class = "Maps"
    Rarity = Rare
    MapTier >= 6
    SetBackgroundColor 255 0 0 100
    PlayAlertSound 2 300

# Rarity is "Rare" - Tier is Any
Show
    Class = "Maps"
    Rarity = Rare
    SetBackgroundColor 255 0 0 100

# Rarity is "Magic" - Tier is "High Tier"
Show
    Class = "Maps"
    Rarity = Magic
    MapTier >= 11
    PlayAlertSound 1 300

# Rarity is "Magic" - Tier is "Middle Tier"
Show
    Class = "Maps"
    Rarity = Magic
    MapTier >= 6
    PlayAlertSound 2 300

# Rarity is "Magic" - Tier is Any
Hide
    Class = "Maps"
    Rarity = Magic

# Rarity is Any - Tier is "High Tier"
Show
    Class = "Maps"
    MapTier >= 11
    PlayAlertSound 1 300

# Rarity is Any - Tier is "Middle Tier"
# Unset

# Rarity is Any - Tier is Any
Show
    Class = "Maps"


  `

  const generator = new Generator(scriptObject, "9.8.7")
  const result = generator.generate()

  t.is(result, expected)
})
