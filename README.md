# Advanced PoE Filter [![Test and Lint](https://github.com/isuke/advanced-poe-filter/actions/workflows/main.yml/badge.svg)](https://github.com/isuke/advanced-poe-filter/actions/workflows/main.yml) [!["git-consistent friendly"](https://img.shields.io/badge/git--consistent-friendly-brightgreen.svg)]("https://github.com/isuke/git-consistent") [![npm](https://img.shields.io/npm/v/advanced-poe-filter.svg)](https://www.npmjs.com/package/advanced-poe-filter)

Advanced PoE Filter is used by [Filter of Kalandra](https://filter-of-kalandra.netlify.com/).

## What is this?

This is compiler. Convert **rich** filter syntax to PoE filter syntax.

###### input

```
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
```

###### output

```
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
```

## Usage

```js
import { compile } from 'advanced-poe-filter'

const result = compile(advancedScriptText)
```

## deploy

```sh
$ npm run deploy
```
