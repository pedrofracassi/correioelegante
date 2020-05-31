const TextToSVG = require('text-to-svg')

const styles = {
  medium: TextToSVG.loadSync('./src/fonts/Poppins-Medium.ttf'),
  black: TextToSVG.loadSync('./src/fonts/Poppins-Black.ttf')
}

module.exports = class TextUtils {
  static getTextPath(text, fontStyle, fontSize) {
    const font = styles[fontStyle]
    return font.getD(text, { anchor: 'top left', fontSize: fontSize })
  }

  static getParagraphLines (text, fontStyle, fontSize, lineHeight, maxWidth, maxHeight, widthMargin = 0) {
    const font = styles[fontStyle]

    const words = text.split(' ')
    let lines = [
      []
    ]

    let currentLine = 0

    words.forEach(w => {
      if (font.getMetrics(lines[currentLine].concat(w).join(' '), { fontSize }).width < maxWidth - widthMargin) {
        lines[currentLine].push(w)
      } else {
        currentLine++
        lines[currentLine] = [ w ]
      }
    })

    return lines.map(line => line.join(' '))
  }
}