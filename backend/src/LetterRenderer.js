const svgdom = require('svgdom')
const SVG = require('@svgdotjs/svg.js')
const sharp = require('sharp')

const Assets = require('./Assets.js')

SVG.extend([SVG.Path, SVG.Circle], {
  rightmost: function () {
    return this.x() + this.width()
  },
  lowermost: function () {
    return this.y() + this.height()
  }
})

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

const dummyLetter = require('../../model.json')

module.exports = class LetterRenderer {
  static render (letter = dummyLetter) {
    const window = svgdom.createSVGWindow()
    const document = window.document
    SVG.registerWindow(window, document)
    const canvas = SVG.SVG(document.documentElement)

    canvas.viewbox(0, 0, WIDTH, HEIGHT)

    // Background
    canvas.rect(WIDTH, HEIGHT).fill(BACKGROUND_COLOR)

    // Header
    const headerContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEADER_HEIGHT)
      .move(PADDING, TOP_PADDING)

    headerContainer.path(TextUtils.getTextPath('PARA', 'medium', 26))
      .fill(CONTENT_FONT_COLOR)
    const recipientNameText = headerContainer.path(TextUtils.getTextPath(letter.recipient.name, 'black', 60))
      .fill(CONTENT_FONT_COLOR)
      recipientNameText.y(headerContainer.height() - recipientNameText.height())

    // Logo
    const logoIconContainer = canvas.nested()
    logoIconContainer.svg(Assets.ICON_CORREIO_ELEGANTE)
    logoIconContainer
      .size(121, 116)
      .x(WIDTH - logoIconContainer.width() - PADDING)
      .y(TOP_PADDING - 24)

    const logoTextContainer = canvas.nested()
    logoTextContainer.svg(Assets.TEXT_CORREIO_ELEGANTE)
    logoTextContainer
      .size(269, 106)
      .x(WIDTH - logoTextContainer.width() - PADDING - 44)
      .y(TOP_PADDING - 24 + 16)

    // Content
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

    // Footer
    const footerContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEADER_HEIGHT)
      .move(PADDING, TOP_PADDING + headerContainer.height() +TOP_PADDING + PADDING + contentContainer.height())

    footerContainer.svg(Assets.ICON_SPECULUM)
      .height(footerContainer.height())
      .width(footerContainer.width())

    const senderTagText = footerContainer.path(TextUtils.getTextPath('DE', 'medium', 26))
      .fill(CONTENT_FONT_COLOR)
    const senderNameText = footerContainer.path(TextUtils.getTextPath(letter.sender.name, 'black', 60))
      .fill(CONTENT_FONT_COLOR)
    senderNameText
      .x(footerContainer.width() - senderNameText.width())
      .y(headerContainer.height() - senderNameText.height())
    senderTagText
      .x(footerContainer.width() - senderNameText.width())

    return sharp(Buffer.from(canvas.svg())).jpeg({ quality: 100 }).toBuffer()
  }
}