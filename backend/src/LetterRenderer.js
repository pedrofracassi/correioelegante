const svgdom = require('svgdom')
const SVG = require('@svgdotjs/svg.js')
const sharp = require('sharp')
const Twemoji = require('twemoji-parser')
const fetch = require('node-fetch')

const { convert } = require('convert-svg-to-jpeg')

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

const COLORS = [BACKGROUND_COLOR, '#4a5bda', '#4adace', '#da4a98', '#4ada8e']

const FOOTER_HEIGHT = HEADER_HEIGHT = 80

const CONTENT_FONT_SIZE = 60
const CONTENT_FONT_COLOR = '#ffffff'

const PADDING = 45
const TOP_PADDING = 80

module.exports = class LetterRenderer {
  static async render (letter, svg) {
    const window = svgdom.createSVGWindow()
    const document = window.document
    SVG.registerWindow(window, document)
    const canvas = SVG.SVG(document.documentElement)

    canvas
      .viewbox(0, 0, WIDTH, HEIGHT)
      .width(WIDTH)
      .height(HEIGHT)

    // Background
    canvas.rect(WIDTH, HEIGHT).fill(COLORS[[Math.floor(Math.random() * COLORS.length)]])

    // Header
    const headerContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEADER_HEIGHT)
      .move(PADDING, TOP_PADDING)

    const headerTagText = headerContainer.path(TextUtils.getTextPath(`PARA`, 'medium', 26))
      .fill(CONTENT_FONT_COLOR)
    const recipientNameText = headerContainer.path(TextUtils.getTextPath(TextUtils.getShortenedName(letter.recipient.name), 'black', 60))
      .fill(CONTENT_FONT_COLOR)
    recipientNameText.y(headerTagText.height() + 10)
    const recipientClassroomText = headerContainer.path(TextUtils.getTextPath(TextUtils.getClassroomDisplayName(letter.recipient.classroom), 'medium', 26))
      .fill(CONTENT_FONT_COLOR)
    recipientClassroomText
      .x(recipientNameText.width() + 10)
      .y(headerContainer.height() - recipientClassroomText.height())
    

    // Logo
    const logoIconContainer = canvas.nested()
    logoIconContainer.svg(Assets.ICON_CORREIO_ELEGANTE)
    logoIconContainer
      .size(121, 116)
      .width(121)
      .height(116)
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

    const { contentLines, fontSize, lineHeight } = TextUtils.getParagraphLines({
      text: letter.content,
      fontStyle: 'medium',
      fontSize: CONTENT_FONT_SIZE,
      maxWidth: contentContainer.width(),
      maxHeight: contentContainer.height(),
      widthMargin: 15
    })

    try {
      for (const [index, line] of contentLines.entries()) {
        console.log(`Drawing line ${index + 1}/${contentLines.length} - "${line.trim()}"`)
        const lineContainer = letterTextContainer.nested()
          .y(lineHeight * index)
          .height(lineHeight)
        
        let currentX = 0

        TextUtils.getTextEntities(line.trim()).forEach(entity => {
          if (typeof entity === 'string') {
            lineContainer.path(TextUtils.getTextPath(entity, 'medium', fontSize))
              .fill(CONTENT_FONT_COLOR)
              .x(currentX)
          } else if (typeof entity === 'object') {
            console.log(currentX)
            const emojiContainer = lineContainer.nested()
            emojiContainer.image(entity.url)
              .size(fontSize, fontSize)
              .x(currentX)
              .y((lineHeight - fontSize)/2)
          }
          currentX = currentX + TextUtils.getTextWidth(entity, 'medium', fontSize)
        })

        lineContainer.x((letterTextContainer.width() - currentX)/2)
      }
    } catch (e) {
      console.error(e)
    }

    letterTextContainer.height(contentLines.length * lineHeight)
    letterTextContainer
      .y((contentContainer.height() - letterTextContainer.height())/2)

    // Footer
    const footerContainer = canvas.nested()
      .width(WIDTH - PADDING * 2)
      .height(HEADER_HEIGHT)
      .move(PADDING, TOP_PADDING + headerContainer.height() +TOP_PADDING + PADDING + contentContainer.height())

    const footerIconContainer = footerContainer.nested()
      .size(80, 80)
      .svg(Assets.ICON_SPECULUM)

    if (letter.sender.anonymous) {
      footerIconContainer.x((footerContainer.width() - footerIconContainer.width())/2)
    } else {
      const senderClassroomText = footerContainer.path(TextUtils.getTextPath(TextUtils.getClassroomDisplayName(letter.sender.classroom), 'medium', 26))
        .fill(CONTENT_FONT_COLOR)
      senderClassroomText
        .x(footerContainer.width() - senderClassroomText.width())
        .y(footerContainer.height() - senderClassroomText.height())
      const senderTagText = footerContainer.path(TextUtils.getTextPath('DE', 'medium', 26))
        .fill(CONTENT_FONT_COLOR)
      const senderNameText = footerContainer.path(TextUtils.getTextPath(TextUtils.getShortenedName(letter.sender.name), 'black', 60))
        .fill(CONTENT_FONT_COLOR)
      senderNameText
        .x(footerContainer.width() - senderNameText.width() - senderClassroomText.width() - 10)
        .y(headerContainer.height() - senderNameText.height())
      senderTagText
        .x(footerContainer.width() - senderNameText.width() - senderClassroomText.width() - 10)
    }

    console.log('Rastering')

    try {
      const jpeg = await convert(canvas.svg(), {
        height: 1080,
        width: 1080
      })
      return jpeg
    } catch (e) {
      console.error(e)
    }

  }
}