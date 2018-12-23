const test = require('ava')
const outdent = require('outdent')

const compiler = require('../lib/index')

test('compile : single section', (t) => {
  const advancedScriptText = outdent`
Show "Map Section"
    Class "Maps"
    MapTier > 3

    SetBorderColor 250 251 252
    PlayAlertSound 1 300

   `

  const expected = outdent`
################################################################################
# Map Section                                                                  #
################################################################################
Show
    Class "Maps"
    MapTier > 3
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


  `

  const result = compiler.compile(advancedScriptText)

  t.deepEqual(result, expected)
})

test('compile : single section', (t) => {
  const advancedScriptText = outdent`
Hide "Hide Map Section"
    Class "Maps"
    MapTier <= 4

Show "Flask Section"
    Class "Life Flasks" "Mana Flasks" "Hybrid Flasks"

    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300

   `

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
    SetBorderColor 250 251 252 255
    PlayAlertSound 1 300


  `

  const result = compiler.compile(advancedScriptText)

  t.is(result, expected)
})

test('parse : multi mixin', (t) => {
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

  const expected = outdent`
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


  `

  const result = compiler.compile(advancedScriptText)

  t.is(result, expected)
})
