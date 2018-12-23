{
  const indent = '    '
  let indentLevel = 0

  function getIndentLevel(i) { return i.split(indent).length - 1 }
}

//
// Base Grammar
//
start = script

script = blankOrCommentLine* sections:(section blankOrCommentLine*)* { return sections.map(s => s[0]) }

section = block:block

block =
  activity:('Show' / 'Hide') __ name:string br
  INDENT
    line0:line
    blankOrCommentLine*
    lines:(SAMEDENT line blankOrCommentLine*)*
    mixins:(SAMEDENT mixin blankOrCommentLine*)*
  OUTDENT {
    let conditions = {};
    let actions = {};

    [line0].concat(lines.map(l => l[1])).forEach((line) => {
      if(line.lineType == 'condition') {
        conditions[line.attr] = line.val
      } else if(line.lineType == 'action') {
        actions[line.attr] = line.val
      }
    })

    let allMixins = mixins.map(m => m[1])

    return { name, activity, conditions, actions, mixins: allMixins }
  }

line = line:(condition / action) br { return line }

mixin =
  'Mixin' __ name:string br
  INDENT
    block0:block
    blankOrCommentLine*
    blocks:(SAMEDENT block)*
    blankOrCommentLine*
  OUTDENT {
    let allBlocks = [block0].concat(blocks.map(b => b[1]))
    return { name, blocks: allBlocks }
  }

blankLine = [\n] { return undefined }
commentLine = _* '#' comment:$[^\n]* { return comment }
blankOrCommentLine = blankLine / commentLine

//
// Condition
//
condition =
    conditionClass
  / conditionBaseType
  / conditionProphecy
  / conditionDropLevel
  / conditionItemLevel
  / conditionGemLevel
  / conditionStackSize
  / conditionMapTier
  / conditionQuality
  / conditionLinkedSockets
  / conditionSockets
  / conditionSocketGroup
  / conditionRarity
  / conditionShaperItem
  / conditionElderItem
  / conditionCorrupted
  / conditionIdentified
  / conditionShapedMap
  / conditionHeight
  / conditionWidth
  / conditionHasExplicitMod

// Condition Attributes
conditionClass          = attr:'Class'          __ val:conditionValueArray      { return { lineType: 'condition', attr, val} }
conditionBaseType       = attr:'BaseType'       __ val:conditionValueArray      { return { lineType: 'condition', attr, val} }
conditionProphecy       = attr:'Prophecy'       __ val:conditionValueArray      { return { lineType: 'condition', attr, val} }
conditionDropLevel      = attr:'DropLevel'      __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionItemLevel      = attr:'ItemLevel'      __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionGemLevel       = attr:'GemLevel'       __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionStackSize      = attr:'StackSize'      __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionMapTier        = attr:'MapTier'        __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionQuality        = attr:'Quality'        __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionLinkedSockets  = attr:'LinkedSockets'  __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionSockets        = attr:'Sockets'        __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionSocketGroup    = attr:'SocketGroup'    __ val:conditionValueSocketRGBW { return { lineType: 'condition', attr, val} }
conditionRarity         = attr:'Rarity'         __ val:conditionValueRarity     { return { lineType: 'condition', attr, val} }
conditionShaperItem     = attr:'ShaperItem'     __ val:conditionValueBoolean    { return { lineType: 'condition', attr, val} }
conditionElderItem      = attr:'ElderItem'      __ val:conditionValueBoolean    { return { lineType: 'condition', attr, val} }
conditionCorrupted      = attr:'Corrupted'      __ val:conditionValueBoolean    { return { lineType: 'condition', attr, val} }
conditionIdentified     = attr:'Identified'     __ val:conditionValueBoolean    { return { lineType: 'condition', attr, val} }
conditionShapedMap      = attr:'ShapedMap'      __ val:conditionValueBoolean    { return { lineType: 'condition', attr, val} }
conditionHeight         = attr:'Height'         __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionWidth          = attr:'Width'          __ val:conditionValueNumber     { return { lineType: 'condition', attr, val} }
conditionHasExplicitMod = attr:'HasExplicitMod' __ val:conditionValueArray      { return { lineType: 'condition', attr, val} }

// Condition Values
conditionValueArray = names
conditionValueNumber = operator:operator __ num:num { return `${operator} ${num}` }
conditionValueSocketRGBW = socketRGBW
conditionValueRarity = operator:(operator __)? rarity:rarity { return operator ? `${operator[0]} ${rarity}` : rarity }
conditionValueBoolean = boolean

//
// Action
//
action =
    actionSetBorderColor
  / actionSetTextColor
  / actionSetBackgroundColor
  / actionSetFontSize
  / actionPlayAlertSound
  / actionPlayAlertSoundPositional
  / actionDisableDropSound
  / actionCustomAlertSound
  / actionMinimapIcon
  / actionPlayEffect

// Action Attributes
actionSetBorderColor           = attr:'SetBorderColor'           __ val:actionValueColor       { return { lineType: 'action', attr, val } }
actionSetTextColor             = attr:'SetTextColor'             __ val:actionValueColor       { return { lineType: 'action', attr, val } }
actionSetBackgroundColor       = attr:'SetBackgroundColor'       __ val:actionValueColor       { return { lineType: 'action', attr, val } }
actionSetFontSize              = attr:'SetFontSize'              __ val:actionValueFontSize    { return { lineType: 'action', attr, val } }
actionPlayAlertSound           = attr:'PlayAlertSound'           __ val:actionValueSound       { return { lineType: 'action', attr, val } }
actionPlayAlertSoundPositional = attr:'PlayAlertSoundPositional' __ val:actionValueSound       { return { lineType: 'action', attr, val } }
actionDisableDropSound         = attr:'DisableDropSound'         __ val:actionValueBoolean     { return { lineType: 'action', attr, val } }
actionCustomAlertSound         = attr:'CustomAlertSound'         __ val:actionValueFilePath    { return { lineType: 'action', attr, val } }
actionMinimapIcon              = attr:'MinimapIcon'              __ val:actionValueMinimapIcon { return { lineType: 'action', attr, val } }
actionPlayEffect               = attr:'PlayEffect'               __ val:actionValuePlayEffect  { return { lineType: 'action', attr, val } }

// Action Values
actionValueColor = red:rgbaNum __ green:rgbaNum __ blue:rgbaNum alpha:(__ rgbaNum)? { return `${red} ${green} ${blue} ${alpha ? alpha[1] : 255}` }
actionValueFontSize = fontSize
actionValueSound = id:soundId __ volume:soundVolume { return `${id} ${volume}` }
actionValueBoolean = boolean
actionValueFilePath = string
actionValueMinimapIcon = size:minimapIconSize __ color:minimapIconColor __ shape:minimapIconShape { return `${size} ${color} ${shape}` }
actionValuePlayEffect = color:playEffectColor temp:(__ 'Temp')? { return temp ? `${color} Temp` : `${color}` }

//
// Value
//
names = name0:string names:(__ string)* { return [name0].concat(names.map((n) => n[1])) }
operator = '<=' / '>=' / '<' / '>' / '='
rarity = 'Normal' / 'Magic' / 'Rare' / 'Unique'
socketRGBW = r:'R'* g:'G'* b:'B'* w:'W'* { return r.concat(g, b, w).join('') }
rgbaNum = num:num &{ return 0 <= num && num <= 255 } { return num }
fontSize = num:num &{ return 18 <= num && num <= 45 } { return num }
minimapIconSize = '0' / '1' / '2'
minimapIconColor = 'Red' / 'Green' / 'Blue' / 'Brown' / 'White' / 'Yellow'
minimapIconShape = 'Circle' / 'Diamond' / 'Hexagon' / 'Square' / 'Star' / 'Triangle'
playEffectColor = 'Red' / 'Green' / 'Blue' / 'Brown' / 'White' / 'Yellow'
soundId =
    '1' / '2' / '3' / '4' / '5' / '6' / '7' / '8' / '9' / '10'
  / '11' / '12' / '13' / '14' / '15' / '16'
  / 'ShAlchemy' / 'ShBlessed' / 'ShChaos' / 'ShDivine' / 'ShExalted' / 'ShFusing' / 'ShGeneral' / 'ShMirror' / 'ShRegal' / 'ShVaal'
soundVolume = num:num &{ return 0 <= num && num <= 300 } { return num }

//
// Atomic Value
//
boolean = val:('True' / 'False') { return val === 'True' }
string = '"' string:$[^\n|^"]* '"' { return string }
num = num:$[0-9]+ { return parseInt(num, 10) }

//
// Base Token
//
br = [\n] { return undefined }
_ = ' '
__ = _+ { return ' ' }
indent = '    '

//
// Indent
//
SAMEDENT
  = i:$indent* &{ return getIndentLevel(i) === indentLevel } { return indentLevel }

INDENT
  = i:$indent+ &{ return getIndentLevel(i) > indentLevel } { indentLevel += 1; return indentLevel }

OUTDENT
  = '' { indentLevel -= 1; return indentLevel  }
