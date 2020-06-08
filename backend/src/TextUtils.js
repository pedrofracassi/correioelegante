const TextToSVG = require('text-to-svg')
const Twemoji = require('twemoji-parser')

const styles = {
  medium: TextToSVG.loadSync('./src/fonts/Poppins-Medium.ttf'),
  black: TextToSVG.loadSync('./src/fonts/Poppins-Black.ttf')
}

module.exports = class TextUtils {

  static getTextWidth(text, fontStyle, fontSize) {
    if (typeof text === 'string') {
      let accumulatedWidth = 0

      this.getTextEntities(text).forEach(entity => {
        if (typeof entity === 'string') {
          accumulatedWidth = accumulatedWidth + styles[fontStyle].getMetrics(entity, { fontSize: fontSize }).width
        } else if (typeof entity === 'object') {
          accumulatedWidth = accumulatedWidth + fontSize*1.15
        }
      })

      return accumulatedWidth
    } else {
      return fontSize*1.15
    }
  }

  static getTextEntities(text) {
    let unparsedText = text
    let lastEmojiIndex = 0
    let textEntities = []

    Twemoji.parse(text).forEach(emoji => {
      textEntities.push(unparsedText.slice(0, emoji.indices[0] - lastEmojiIndex))
      textEntities.push(emoji)
      unparsedText = unparsedText.slice(emoji.indices[1] - lastEmojiIndex)
      lastEmojiIndex = emoji.indices[1]
    })

    textEntities.push(unparsedText)

    return textEntities
  }

  static getClassroomDisplayName(classroom) {
    switch(classroom) {
      case 'EX':
        return 'Ex-aluno'
      case 'VS':
        return 'Visitante'
      default:
        return `${classroom[0]}º${classroom[1]}`
    }
  }

  static getPersonDisplayName(person) {
    if (person.anonymous) return 'Anônimo(a)'
    return `${person.name}${person.classroom ? ` (${this.getClassroomDisplayName(person.classroom)})` : ''}${person.instagram ? ` (@${person.instagram})` : ''}`
  }

  static getShortenedName(name) {
    const split = name.split(' ')
    if (split.length > 1) {
      return `${split[0]} ${split[split.length - 1]}`
    } else {
      return name
    }
  }

  static getTextPath(text, fontStyle, fontSize) {
    const font = styles[fontStyle]
    return font.getD(text, { anchor: 'top left', fontSize: fontSize })
  }

  static getParagraphLines (config) {
    const { text, fontStyle, fontSize, maxWidth, maxHeight, widthMargin = 0 } = config
    const font = styles[fontStyle]

    const words = insertBetween('\n', text.split('\n').map(word => word.split(' '))).flat()
    let lines = [
      []
    ]

    let currentLine = 0

    words.forEach(w => {
      if (w === '\n') {
        currentLine++
        lines[currentLine] = [ '' ]
      } else if (this.getTextWidth(lines[currentLine].concat(w).join(' '), fontStyle, fontSize) < maxWidth - 2*widthMargin) {
        lines[currentLine].push(w)
      } else {
        currentLine++
        lines[currentLine] = [ w ]
      }
    })

    const result = {
      contentLines: lines.map(line => line.join(' ')),
      lineHeight: fontSize + fontSize/3,
      fontSize
    }

    if (result.contentLines.length * result.lineHeight < maxHeight || fontSize === 1) {
      return result
    } else {
      return this.getParagraphLines({ ...config, fontSize: fontSize - 2 })
    }
  }
}

function insertBetween (insertion, array) {
  const indexOfLastItem = array.length - 1;
  return array.reduce(withInsertion, []);

  function withInsertion(newArray, item, index, array) {
      return index < indexOfLastItem 
          ? newArray.concat(item, insertion) 
          : newArray.concat(item);
  }
}