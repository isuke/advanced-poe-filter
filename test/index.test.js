import test from 'ava'
import outdent from 'outdent'

import { getObject, compile, version } from '../src/index'

test('version', (t) => {
  t.is(version, '0.9.3')
})

test('getObject : single section', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False
    BlightedMap True

    # This is Comment
    SetBorderColor 250 251 252
    PlayAlertSound 1 300
    MinimapIcon Medium Red Circle
    PlayEffect Blue Temp


   `

  const expected = {
    'No Name': [
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
              Identified: false,
              BlightedMap: true,
            },
            actions: {
              SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
              PlayAlertSound: { id: '1', volume: 300 },
              MinimapIcon: { size: 'Medium', color: 'Red', shape: 'Circle' },
              PlayEffect: { color: 'Blue', temp: true },
            },
          },
        ],
      },
    ],
  }

  const result = getObject(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single section (all Conditions and Actions)', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "All Conditions and Actions"
    Class          "Maps"
    BaseType       "Sacrificial Garb"
    Prophecy       == "Foo"
    DropLevel      > 85
    ItemLevel      >= 70
    GemLevel       = 10
    GemQualityType "Superior"
    StackSize      < 11
    MapTier        <= 12
    Quality        = 15
    LinkedSockets  = 6
    Sockets        = 5
    SocketGroup    RGB
    Rarity         = Rare
    ShaperItem     True
    ElderItem      False
    FracturedItem  False
    SynthesisedItem False
    Corrupted      True
    Identified     True
    ShapedMap      True
    ElderMap       True
    BlightedMap    True
    Height         > 1
    Width          > 2
    HasExplicitMod "Piyo"
    AnyEnchantment True
    HasEnchantment "Enchantment Decree of Force"
    HasInfluence "Shaper" "Elder"
    EnchantmentPassiveNode "Damage while you have a Herald" "Projectile Damage"
    AlternateQuality True
    Replica        True

    # This is Comment
    SetBorderColor           100 101 102
    SetTextColor             103 104 105
    SetBackgroundColor       106 107 108
    SetFontSize              30
    PlayAlertSound           16 300
    DisableDropSound         False
    CustomAlertSound         "C\\foobar\\sound.mp3"
    MinimapIcon              Largest Cyan Cross
    PlayEffect               Grey


   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# All Conditions and Actions                                                   #
################################################################################
Show
    Class = "Maps"
    BaseType = "Sacrificial Garb"
    Rarity = Rare
    Prophecy == "Foo"
    DropLevel > 85
    ItemLevel >= 70
    GemLevel = 10
    GemQualityType = "Superior"
    StackSize < 11
    MapTier <= 12
    Quality = 15
    LinkedSockets = 6
    Sockets = 5
    SocketGroup RGB
    ShaperItem True
    ElderItem False
    FracturedItem False
    SynthesisedItem False
    Corrupted True
    Identified True
    ShapedMap True
    ElderMap True
    BlightedMap True
    Height > 1
    Width > 2
    HasExplicitMod = "Piyo"
    AnyEnchantment True
    HasEnchantment = "Enchantment Decree of Force"
    HasInfluence = "Shaper" "Elder"
    EnchantmentPassiveNode = "Damage while you have a Herald" "Projectile Damage"
    AlternateQuality True
    Replica True
    SetFontSize 30
    SetTextColor 103 104 105 255
    SetBackgroundColor 106 107 108 255
    SetBorderColor 100 101 102 255
    MinimapIcon 0 Cyan Cross
    PlayEffect Grey
    PlayAlertSound 16 300
    CustomAlertSound "C\\foobar\\sound.mp3"
    DisableDropSound False


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single section with variables', (t) => {
  const advancedScriptText = outdent`
Show "Flasks"
    Class Var("My Class") "Utility Flasks"
    Identified False

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const variables = {
    'My Class': ['Life Flasks', 'Mana Flasks', 'Hybrid Flasks'],
  }

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    Identified False
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
  }

  const result = compile(advancedScriptText, variables)

  t.deepEqual(result, expected)
})

test('compile : single section with properties', (t) => {
  const advancedScriptText = outdent`
Show "Flasks"
    Class "Utility Flasks"
    Quality >= Prop("Flask Quality")

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const properties = {
    T1: { 'Flask Quality': 0 },
    T2: { 'Flask Quality': 10 },
    T3: { 'Flask Quality': 20 },
  }

  const filterInfo = { name: 'My Filter' }

  const expected = {
    T1: outdent`
################################################################################
#                                                                              #
# My Filter - T1 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 0
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T2: outdent`
################################################################################
#                                                                              #
# My Filter - T2 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 10
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T3: outdent`
################################################################################
#                                                                              #
# My Filter - T3 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 20
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
  }

  const result = compile(advancedScriptText, {}, properties, filterInfo)

  t.deepEqual(result, expected)
})

test('compile : single section with combined variables and properties', (t) => {
  const advancedScriptText = outdent`
Show "Flasks"
    Class "Utility Flasks"
    Quality >= Prop("Flask Quality")

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const variables = {
    'Low Quality': 0,
    'Middle Quality': 10,
    'High Quality': 20,
  }

  const properties = {
    T1: { 'Flask Quality': 'Var("Low Quality")' },
    T2: { 'Flask Quality': 'Var("Middle Quality")' },
    T3: { 'Flask Quality': 'Var("High Quality")' },
  }

  const filterInfo = { name: 'My Filter' }

  const expected = {
    T1: outdent`
################################################################################
#                                                                              #
# My Filter - T1 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 0
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T2: outdent`
################################################################################
#                                                                              #
# My Filter - T2 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 10
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T3: outdent`
################################################################################
#                                                                              #
# My Filter - T3 -                                                             #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class = "Utility Flasks"
    Quality >= 20
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
  }

  const result = compile(advancedScriptText, variables, properties, filterInfo)

  t.deepEqual(result, expected)
})

test('compile : single section with filterInfo', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False
    HasEnchantment "Enchantment Decree of Force"

    # This is Comment
    SetBorderColor 250 251 252
    PlayAlertSound 1 300
    MinimapIcon Medium Red Circle
    PlayEffect Blue Temp


   `

  const filterInfo = { name: 'My Filter', version: '3.4.5' }

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# My Filter (Ver: 3.4.5)                                                       #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class = "Maps"
    MapTier > 3
    Identified False
    HasEnchantment = "Enchantment Decree of Force"
    SetFontSize 32
    SetBorderColor 250 251 252 255
    MinimapIcon 1 Red Circle
    PlayEffect Blue Temp
    PlayAlertSound 1 300


    `,
  }

  const result = compile(advancedScriptText, {}, {}, filterInfo)

  t.deepEqual(result, expected)
})

test('compile : multi section', (t) => {
  const advancedScriptText = outdent`
Hide "Hide Map Section"
    Class "Maps"
    MapTier <= 4

Show "Flask Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks"

    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300

Hide "Remain Section"

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Hide Map Section                                                             #
################################################################################
Hide
    Class = "Maps"
    MapTier <= 4
    SetFontSize 32
    DisableDropSound True


################################################################################
# Flask Section                                                                #
################################################################################
Show
    Class = "Life Flasks" "Mana Flasks" "Hybrid Flasks"
    SetFontSize 32
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


################################################################################
# Remain Section                                                               #
################################################################################
Hide
    SetFontSize 32
    DisableDropSound True


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single fork', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Maps"
    SetBorderColor     200 100 50 123

    Fork "Rarity"
        Show "Rare"
            Rarity = Rare
            SetBorderColor     200 100 51 123
        Hide "Magic"
            Rarity = Magic
            SetBorderColor     200 100 52 123
        Unset "Normal"
            Rarity = Normal
            SetBorderColor     200 100 53 123

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare"
Show
    Class = "Maps"
    Rarity = Rare
    SetFontSize 32
    SetBorderColor 200 100 51 123

# Rarity is "Magic"
Hide
    Class = "Maps"
    Rarity = Magic
    SetFontSize 32
    SetBorderColor 200 100 52 123
    DisableDropSound True

# Rarity is "Normal"
Show
    Class = "Maps"
    Rarity = Normal
    SetFontSize 32
    SetBorderColor 200 100 53 123


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single mixin with color function', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Maps"

    SetBorderColor     200 100 50 123
    SetTextColor       200 100 50 123
    SetBackgroundColor 200 100 50 123

    Mixin "Rarity"
        Show "Rare"
            Rarity = Rare

            SetBorderColor     Negate()
            SetTextColor       Grayscale()
            SetBackgroundColor Lighten(30%)

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare"
Show
    Class = "Maps"
    Rarity = Rare
    SetFontSize 32
    SetTextColor 125 125 125 123
    SetBackgroundColor 218 144 107 123
    SetBorderColor 55 155 205 123

# Rarity is Any
Show
    Class = "Maps"
    SetFontSize 32
    SetTextColor 200 100 50 123
    SetBackgroundColor 200 100 50 123
    SetBorderColor 200 100 50 123


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single mixin with fontSize function', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Maps"

    Mixin "Rarity"
        Show "Rare"
            Rarity = Rare
            SetFontSize Plus(5)
        Show "Magic"
            Rarity = Rare
            SetFontSize Minus(6)

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare"
Show
    Class = "Maps"
    Rarity = Rare
    SetFontSize 37

# Rarity is "Magic"
Show
    Class = "Maps"
    Rarity = Rare
    SetFontSize 26

# Rarity is Any
Show
    Class = "Maps"
    SetFontSize 32


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : multi mixin', (t) => {
  const advancedScriptText = outdent`
Hide "Gears"
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"

    Mixin "Rarity"
        Show "Rare"
            Rarity Rare
            SetFontSize 45
            PlayEffect Yellow Temp
        Hide "Magic"
            Rarity Magic
            SetFontSize 36
        Hide "Normal"
            Rarity Normal
            SetFontSize 18

    Mixin "BaseType"
        Show "Special BodyArmour"
            BaseType "Sacrificial Garb"
            SetBackgroundColor 100 100 255 255
            PlayAlertSound 1 300
            PlayEffect Blue
        Show "Special Glove and Boots"
            BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
            SetBackgroundColor 50 50 255 255
            PlayAlertSound 2 300
            PlayEffect Blue Temp

    Mixin "Sockets and Link"
        Show "6L"
            LinkedSockets = 6
            SetBorderColor 255 0 0 255
            PlayAlertSound 3 300
            PlayEffect Red
        Show "6S"
            Sockets = 6
            SetBorderColor 0 255 0 255
            PlayAlertSound 4 300
            PlayEffect Red
        Show "RGB"
            SocketGroup RGB
            SetBorderColor 0 0 255 255
            PlayAlertSound 5 100
            PlayEffect Red Temp

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Gears                                                                        #
################################################################################
# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Rare
    LinkedSockets = 6
    SetFontSize 45
    SetBackgroundColor 100 100 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Rare
    Sockets = 6
    SetFontSize 45
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Rare
    SocketGroup RGB
    SetFontSize 45
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Rare
    SetFontSize 45
    SetBackgroundColor 100 100 255 255
    PlayEffect Blue
    PlayAlertSound 1 300

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Rare
    LinkedSockets = 6
    SetFontSize 45
    SetBackgroundColor 50 50 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Rare
    Sockets = 6
    SetFontSize 45
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Rare
    SocketGroup RGB
    SetFontSize 45
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Rare
    SetFontSize 45
    SetBackgroundColor 50 50 255 255
    PlayEffect Blue Temp
    PlayAlertSound 2 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    LinkedSockets = 6
    SetFontSize 45
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    Sockets = 6
    SetFontSize 45
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SocketGroup RGB
    SetFontSize 45
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Rare" - BaseType is Any - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SetFontSize 45
    PlayEffect Yellow Temp

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Magic
    LinkedSockets = 6
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Magic
    Sockets = 6
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Magic
    SocketGroup RGB
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Magic
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    PlayEffect Blue
    PlayAlertSound 1 300

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Magic
    LinkedSockets = 6
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Magic
    Sockets = 6
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Magic
    SocketGroup RGB
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Magic
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    PlayEffect Blue Temp
    PlayAlertSound 2 300

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    LinkedSockets = 6
    SetFontSize 36
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    Sockets = 6
    SetFontSize 36
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    SocketGroup RGB
    SetFontSize 36
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Magic" - BaseType is Any - Sockets and Link is Any
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    SetFontSize 36
    DisableDropSound True

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Normal
    LinkedSockets = 6
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Normal
    Sockets = 6
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Normal
    SocketGroup RGB
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Normal
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    PlayEffect Blue
    PlayAlertSound 1 300

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Normal
    LinkedSockets = 6
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Normal
    Sockets = 6
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Normal
    SocketGroup RGB
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Rarity Normal
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    PlayEffect Blue Temp
    PlayAlertSound 2 300

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    LinkedSockets = 6
    SetFontSize 18
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    Sockets = 6
    SetFontSize 18
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    SocketGroup RGB
    SetFontSize 18
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is "Normal" - BaseType is Any - Sockets and Link is Any
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    SetFontSize 18
    DisableDropSound True

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    LinkedSockets = 6
    SetFontSize 32
    SetBackgroundColor 100 100 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Sockets = 6
    SetFontSize 32
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    SocketGroup RGB
    SetFontSize 32
    SetBackgroundColor 100 100 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    SetFontSize 32
    SetBackgroundColor 100 100 255 255
    PlayEffect Blue
    PlayAlertSound 1 300

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    LinkedSockets = 6
    SetFontSize 32
    SetBackgroundColor 50 50 255 255
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Sockets = 6
    SetFontSize 32
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SocketGroup RGB
    SetFontSize 32
    SetBackgroundColor 50 50 255 255
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SetFontSize 32
    SetBackgroundColor 50 50 255 255
    PlayEffect Blue Temp
    PlayAlertSound 2 300

# Rarity is Any - BaseType is Any - Sockets and Link is "6L"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    LinkedSockets = 6
    SetFontSize 32
    SetBorderColor 255 0 0 255
    PlayEffect Red
    PlayAlertSound 3 300

# Rarity is Any - BaseType is Any - Sockets and Link is "6S"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Sockets = 6
    SetFontSize 32
    SetBorderColor 0 255 0 255
    PlayEffect Red
    PlayAlertSound 4 300

# Rarity is Any - BaseType is Any - Sockets and Link is "RGB"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    SocketGroup RGB
    SetFontSize 32
    SetBorderColor 0 0 255 255
    PlayEffect Red Temp
    PlayAlertSound 5 100

# Rarity is Any - BaseType is Any - Sockets and Link is Any
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    SetFontSize 32
    DisableDropSound True


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : multi mixin with conflict alert sound', (t) => {
  const advancedScriptText = outdent`
Show "Gears"
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    PlayAlertSoundPositional 2 100

    Mixin "Rarity"
        Show "Rare"
            Rarity Rare
            PlayAlertSound 1 300
    Mixin "BaseType"
        Show "Special BodyArmour"
            BaseType "Sacrificial Garb"
            CustomAlertSound "./Sounds/Unique.wav"

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Gears                                                                        #
################################################################################
# Rarity is "Rare" - BaseType is "Special BodyArmour"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    Rarity Rare
    SetFontSize 32
    CustomAlertSound "./Sounds/Unique.wav"

# Rarity is "Rare" - BaseType is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SetFontSize 32
    PlayAlertSound 1 300

# Rarity is Any - BaseType is "Special BodyArmour"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType = "Sacrificial Garb"
    SetFontSize 32
    CustomAlertSound "./Sounds/Unique.wav"

# Rarity is Any - BaseType is Any
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    SetFontSize 32
    PlayAlertSoundPositional 2 100


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : nested mixin', (t) => {
  const advancedScriptText = outdent`
Hide "Gears"
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"

    Mixin "Rarity"
        Hide "Rare"
            Rarity Rare
            SetFontSize 45
            PlayEffect Yellow Temp

            Mixin "Shaper/Elder"
                Show "Shaper"
                    ShaperItem True
                    SetBackgroundColor 0 0 255 200
                    PlayEffect White
                Show "Elder"
                    ElderItem True
                    SetBackgroundColor 20 20 255 200
                    PlayEffect White
                Ignore "3L"
                    LinkedSockets = 3
                    SetBorderColor 255 0 0
        Hide "Magic"
            Rarity Magic
            SetFontSize 36
        Hide "Normal"
            Rarity Normal
            SetFontSize 18

   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.9.3)                                  #
#                                                                              #
################################################################################

################################################################################
# Gears                                                                        #
################################################################################
# Rarity is "Rare" - Shaper/Elder is "Shaper"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    ShaperItem True
    SetFontSize 45
    SetBackgroundColor 0 0 255 200
    PlayEffect White

# Rarity is "Rare" - Shaper/Elder is "Elder"
Show
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    ElderItem True
    SetFontSize 45
    SetBackgroundColor 20 20 255 200
    PlayEffect White

# Rarity is "Rare" - Shaper/Elder is Any
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SetFontSize 45
    DisableDropSound True

# Rarity is "Magic"
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    SetFontSize 36
    DisableDropSound True

# Rarity is "Normal"
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    SetFontSize 18
    DisableDropSound True

# Rarity is Any
Hide
    Class = "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    SetFontSize 32
    DisableDropSound True


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})
