import test from 'ava'
import outdent from 'outdent'

import { getObject, compile, version } from '../src/index'

test('version', (t) => {
  t.is(version, '0.2.0')
})

test('getObject : single section', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    # This is Comment
    SetBorderColor 250 251 252
    PlayAlertSound 1 300
    MinimapIcon Medium Red Circle


   `

  const expected = {
    'No Name': [
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
              SetBorderColor: { rgb: { r: 250, g: 251, b: 252 }, alpha: 255 },
              PlayAlertSound: { id: '1', volume: 300 },
              MinimapIcon: { size: 'Medium', color: 'Red', shape: 'Circle' },
            },
          },
        ],
      },
    ],
  }

  const result = getObject(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single section', (t) => {
  const advancedScriptText = outdent`
# This is Comment
# This is Comment
Show "Map Section"
    Class "Maps"
    MapTier > 3
    Identified False

    # This is Comment
    SetBorderColor 250 251 252
    PlayAlertSound 1 300
    MinimapIcon Medium Red Circle


   `

  const expected = {
    'No Name': outdent`
################################################################################
#                                                                              #
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class "Maps"
    MapTier > 3
    Identified False
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300
    MinimapIcon 1 Red Circle


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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks" "Utility Flasks"
    Identified False
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

  const name = 'My Filter'

  const expected = {
    T1: outdent`
################################################################################
#                                                                              #
# My Filter (T1)                                                               #
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class "Utility Flasks"
    Quality >= 0
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T2: outdent`
################################################################################
#                                                                              #
# My Filter (T2)                                                               #
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class "Utility Flasks"
    Quality >= 10
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
    T3: outdent`
################################################################################
#                                                                              #
# My Filter (T3)                                                               #
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Flasks                                                                       #
################################################################################
Show
    Class "Utility Flasks"
    Quality >= 20
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


    `,
  }

  const result = compile(advancedScriptText, {}, properties, name)

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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

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
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


################################################################################
# Remain Section                                                               #
################################################################################
Hide
    DisableDropSound True


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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare"
Show
    Class "Maps"
    Rarity = Rare
    SetBorderColor 55 155 205 123
    SetTextColor 125 125 125 123
    SetBackgroundColor 218 144 107 123

# Rarity is Any
Show
    Class "Maps"
    SetBorderColor 200 100 50 123
    SetTextColor 200 100 50 123
    SetBackgroundColor 200 100 50 123


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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Map Section                                                                  #
################################################################################
# Rarity is "Rare"
Show
    Class "Maps"
    Rarity = Rare
    SetFontSize 37

# Rarity is "Magic"
Show
    Class "Maps"
    Rarity = Rare
    SetFontSize 26

# Rarity is Any
Show
    Class "Maps"


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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Gears                                                                        #
################################################################################
# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Sacrificial Garb"
    LinkedSockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 3 300
    SetBorderColor 255 0 0 255

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Sacrificial Garb"
    Sockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 4 300
    SetBorderColor 0 255 0 255

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Sacrificial Garb"
    SocketGroup RGB
    SetFontSize 45
    PlayEffect Red Temp
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 5 100
    SetBorderColor 0 0 255 255

# Rarity is "Rare" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Sacrificial Garb"
    SetFontSize 45
    PlayEffect Blue
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 1 300

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    LinkedSockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 3 300
    SetBorderColor 255 0 0 255

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Sockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 4 300
    SetBorderColor 0 255 0 255

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SocketGroup RGB
    SetFontSize 45
    PlayEffect Red Temp
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 5 100
    SetBorderColor 0 0 255 255

# Rarity is "Rare" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SetFontSize 45
    PlayEffect Blue Temp
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 2 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    LinkedSockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBorderColor 255 0 0 255
    PlayAlertSound 3 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    Sockets = 6
    SetFontSize 45
    PlayEffect Red
    SetBorderColor 0 255 0 255
    PlayAlertSound 4 300

# Rarity is "Rare" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SocketGroup RGB
    SetFontSize 45
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255
    PlayAlertSound 5 100

# Rarity is "Rare" - BaseType is Any - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    SetFontSize 45
    PlayEffect Yellow Temp

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Sacrificial Garb"
    LinkedSockets = 6
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Sacrificial Garb"
    Sockets = 6
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Sacrificial Garb"
    SocketGroup RGB
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is "Magic" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Sacrificial Garb"
    SetFontSize 36
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 1 300
    PlayEffect Blue

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    LinkedSockets = 6
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Sockets = 6
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SocketGroup RGB
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is "Magic" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SetFontSize 36
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 2 300
    PlayEffect Blue Temp

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    LinkedSockets = 6
    SetFontSize 36
    SetBorderColor 255 0 0 255
    PlayAlertSound 3 300
    PlayEffect Red

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    Sockets = 6
    SetFontSize 36
    SetBorderColor 0 255 0 255
    PlayAlertSound 4 300
    PlayEffect Red

# Rarity is "Magic" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    SocketGroup RGB
    SetFontSize 36
    SetBorderColor 0 0 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp

# Rarity is "Magic" - BaseType is Any - Sockets and Link is Any
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    DisableDropSound True
    SetFontSize 36

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Sacrificial Garb"
    LinkedSockets = 6
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Sacrificial Garb"
    Sockets = 6
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Sacrificial Garb"
    SocketGroup RGB
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is "Normal" - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Sacrificial Garb"
    SetFontSize 18
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 1 300
    PlayEffect Blue

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    LinkedSockets = 6
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Sockets = 6
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SocketGroup RGB
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is "Normal" - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SetFontSize 18
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 2 300
    PlayEffect Blue Temp

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    LinkedSockets = 6
    SetFontSize 18
    SetBorderColor 255 0 0 255
    PlayAlertSound 3 300
    PlayEffect Red

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    Sockets = 6
    SetFontSize 18
    SetBorderColor 0 255 0 255
    PlayAlertSound 4 300
    PlayEffect Red

# Rarity is "Normal" - BaseType is Any - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    SocketGroup RGB
    SetFontSize 18
    SetBorderColor 0 0 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp

# Rarity is "Normal" - BaseType is Any - Sockets and Link is Any
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    DisableDropSound True
    SetFontSize 18

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Sacrificial Garb"
    LinkedSockets = 6
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Sacrificial Garb"
    Sockets = 6
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Sacrificial Garb"
    SocketGroup RGB
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is Any - BaseType is "Special BodyArmour" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Sacrificial Garb"
    SetBackgroundColor 100 100 255 255
    PlayAlertSound 1 300
    PlayEffect Blue

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    LinkedSockets = 6
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 3 300
    PlayEffect Red
    SetBorderColor 255 0 0 255

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    Sockets = 6
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 4 300
    PlayEffect Red
    SetBorderColor 0 255 0 255

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SocketGroup RGB
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp
    SetBorderColor 0 0 255 255

# Rarity is Any - BaseType is "Special Glove and Boots" - Sockets and Link is Any
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    BaseType "Two-Toned Boots" "Spiked Gloves" "Gripped Gloves" "Fingerless Silk Gloves" "Bone Helmet"
    SetBackgroundColor 50 50 255 255
    PlayAlertSound 2 300
    PlayEffect Blue Temp

# Rarity is Any - BaseType is Any - Sockets and Link is "6L"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    LinkedSockets = 6
    SetBorderColor 255 0 0 255
    PlayAlertSound 3 300
    PlayEffect Red

# Rarity is Any - BaseType is Any - Sockets and Link is "6S"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Sockets = 6
    SetBorderColor 0 255 0 255
    PlayAlertSound 4 300
    PlayEffect Red

# Rarity is Any - BaseType is Any - Sockets and Link is "RGB"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    SocketGroup RGB
    SetBorderColor 0 0 255 255
    PlayAlertSound 5 100
    PlayEffect Red Temp

# Rarity is Any - BaseType is Any - Sockets and Link is Any
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    DisableDropSound True


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
# Created By Advanced PoE Filter (Ver: 0.2.0)                                  #
#                                                                              #
################################################################################

################################################################################
# Gears                                                                        #
################################################################################
# Rarity is "Rare" - Shaper/Elder is "Shaper"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    ShaperItem True
    SetFontSize 45
    PlayEffect White
    SetBackgroundColor 0 0 255 200

# Rarity is "Rare" - Shaper/Elder is "Elder"
Show
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    ElderItem True
    SetFontSize 45
    PlayEffect White
    SetBackgroundColor 20 20 255 200

# Rarity is "Rare" - Shaper/Elder is Any
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Rare
    DisableDropSound True
    SetFontSize 45

# Rarity is "Magic"
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Magic
    DisableDropSound True
    SetFontSize 36

# Rarity is "Normal"
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    Rarity Normal
    DisableDropSound True
    SetFontSize 18

# Rarity is Any
Hide
    Class "Gloves" "Boots" "Body Armours" "Helmets" "Shields"
    DisableDropSound True


    `,
  }

  const result = compile(advancedScriptText)

  t.deepEqual(result, expected)
})
