const svgdom = require('svgdom')
const SVG = require('@svgdotjs/svg.js')

const TextUtils = require('./TextUtils.js')

const BACKGROUND_COLOR = '#da4a4a'
const WIDTH = 1080
const HEIGHT = 1080

const FOOTER_HEIGHT = HEADER_HEIGHT = 80

const CONTENT_FONT_SIZE = 48
const CONTENT_FONT_LINE_HEIGHT = CONTENT_FONT_SIZE + CONTENT_FONT_SIZE/3
const CONTENT_FONT_COLOR = '#ffffff'

const PADDING = 45
const TOP_PADDING = 80

const dummyLetter = {
  sender: {
    name: 'Pedro Fracassi',
    classroom: '3A'
  },
  recipient: {
    name: 'Fulana',
    classroom: '3B',
    instagram: 'fulana.da.silva'
  },
  content: 'É correio elegante que você quer, @? Então é Correio Elegante que você vai ter!'
}

module.exports = class LetterRenderer {
  static render (letter = dummyLetter) {
    const window = svgdom.createSVGWindow()
    const document = window.document
    SVG.registerWindow(window, document)
    const canvas = SVG.SVG(document.documentElement)

    canvas.viewbox(0, 0, WIDTH, HEIGHT)

    // Background
    canvas.rect(WIDTH, HEIGHT).fill(BACKGROUND_COLOR)

    const headerContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEADER_HEIGHT)
      .move(PADDING, TOP_PADDING)

    const senderTagText = headerContainer.path(TextUtils.getTextPath('PARA', 'medium', 26))
      .fill(CONTENT_FONT_COLOR)
    const senderNameText = headerContainer.path(TextUtils.getTextPath(letter.sender.name, 'black', 60))
      .fill(CONTENT_FONT_COLOR)
      .y(senderTagText.height() + 7)

    const contentContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEIGHT - PADDING * 2 - TOP_PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT)
      .move(PADDING, TOP_PADDING * 2 + HEADER_HEIGHT)

    contentContainer.rect(contentContainer.width(), contentContainer.height())
      .fill('#00000035')
  
    const letterTextContainer = contentContainer.nested()
      .width(contentContainer.width())

    const contentLines = TextUtils.getParagraphLines(letter.content, 'medium', CONTENT_FONT_SIZE, CONTENT_FONT_LINE_HEIGHT, contentContainer.width())
    
    contentLines.forEach((line, index) => {
      const linePath = letterTextContainer.path(TextUtils.getTextPath(line, 'medium', CONTENT_FONT_SIZE))
        .fill('#ffffff')
        .y(index * CONTENT_FONT_LINE_HEIGHT)
      linePath.x((letterTextContainer.width() - linePath.width())/2)
    })

    letterTextContainer.height(contentLines.length * CONTENT_FONT_LINE_HEIGHT)
    letterTextContainer
      .y((contentContainer.height() - letterTextContainer.height())/2)

    return canvas.svg()
  }
}