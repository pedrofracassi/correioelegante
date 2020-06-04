const TextToSVG = require('text-to-svg')

const styles = {
  medium: TextToSVG.loadSync('./src/fonts/Poppins-Medium.ttf'),
  black: TextToSVG.loadSync('./src/fonts/Poppins-Black.ttf')
}

module.exports = class TextUtils {
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

  static getTextPath(text, fontStyle, fontSize) {
    const font = styles[fontStyle]
    return font.getD(text, { anchor: 'top left', fontSize: fontSize })
  }

  static getParagraphLines (text, fontStyle, fontSize, lineHeight, maxWidth, maxHeight, widthMargin = 0) {
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
      } else if (font.getMetrics(lines[currentLine].concat(w).join(' '), { fontSize }).width < maxWidth - 2*widthMargin) {
        lines[currentLine].push(w)
      } else {
        currentLine++
        lines[currentLine] = [ w ]
      }
    })

    return lines.map(line => line.join(' '))
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