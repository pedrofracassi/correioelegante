const { IgApiClient } = require('instagram-private-api')
const { ObjectId } = require('mongodb')

const setRandomInterval = require('set-random-interval')

const LetterRenderer = require('./LetterRenderer')
const TextUtils = require('./TextUtils')

const INTERVALS = {
  direct: {
    MIN_INTERVAL: process.env.MIN_DIRECT_INTERVAL ? parseInt(process.env.MIN_DIRECT_INTERVAL) : 15,
    MAX_INTERVAL: process.env.MAX_DIRECT_INTERVAL ? parseInt(process.env.MAX_DIRECT_INTERVAL) : 20
  },
  feed: {
    MIN_INTERVAL: process.env.MIN_FEED_INTERVAL ? parseInt(process.env.MIN_FEED_INTERVAL) : 45,
    MAX_INTERVAL: process.env.MAX_FEED_INTERVAL ? parseInt(process.env.MAX_FEED_INTERVAL) : 60
  }
}

function randomInterval(min, max) {
  return Math.random() * (max - min + 1) + min;
}

module.exports = class InstagramBot {
  constructor (database) {
    this.database = database
    this.letterCollection = database.collection('letters')
    this.instagramSessionCollection = database.collection('instasessions')
    this.instagram = new IgApiClient()
  }

  async initialize () {
    this.instagram.state.generateDevice(process.env.INSTAGRAM_USERNAME)

    this.instagram.request.end$.subscribe(() => {
      console.info('Caching session data')
      this.instagram.state.serialize().then(serialized => {
        delete serialized.constants
        this.instagramSessionCollection.findOneAndUpdate({ username: process.env.INSTAGRAM_USERNAME }, {
          $set: {
            username: process.env.INSTAGRAM_USERNAME,
            data: JSON.stringify(serialized)
          }
        }, {
          upsert: true
        }).then(({ ok }) => {
          if (!ok) console.error('An error ocurred while caching session data')
        }).catch(err => {
          console.error('An error ocurred while caching session data', err)
        })
      })
    })

    console.info('Looking for session data cache')
    const session = await this.instagramSessionCollection.findOne({ username: process.env.INSTAGRAM_USERNAME })

    if (session) {
      console.info('Using previously cached session data')
      await this.instagram.state.deserialize(session.data)
    } else {
      console.info('No cached session data found')
    }

    try {
      // Test request to check if session is still valid
      const recipients = await this.instagram.direct.rankedRecipients()
    } catch (e) {
      console.log(`Logging in to Instagram as ${process.env.INSTAGRAM_USERNAME}`)

      await this.instagram.simulate.preLoginFlow()
      const user = await this.instagram.account.login(process.env.INSTAGRAM_USERNAME, process.env.INSTAGRAM_PASSWORD)
      await this.instagram.simulate.postLoginFlow()
    }

    console.log(`Logged in.`)

    console.log(`Sending directs with a ${INTERVALS['direct'].MIN_INTERVAL}-${INTERVALS['direct'].MAX_INTERVAL}min interval`)
    console.log(`Posting to feed with a ${INTERVALS['feed'].MIN_INTERVAL}-${INTERVALS['feed'].MAX_INTERVAL}min interval`)

    this.deliverNextLetter('direct')
    this.deliverNextLetter('feed')
  }

  async deliverNextLetter (method = 'direct') {
    console.log(`Looking for first ${method} letter in line...`)
    this.letterCollection.find({ status: 'approved', deliveryMethod: method }).toArray().then(async docs => {
      if (docs.length < 1) return console.log(`No letters in the ${method} delivery queue`)
      const firstInLine = docs.sort((a, b) => a.timestamp - b.timestamp)[0]
      console.log(`Found letter ${firstInLine._id} (${firstInLine.deliveryMethod}). Attempting to render.`)
      const jpeg = await LetterRenderer.render(firstInLine)
      console.log(`Letter rendered successfully. Attempting delivery.`)
      if (firstInLine.deliveryMethod === 'feed') {
        this.deliverViaFeed(firstInLine, jpeg)
      } else if (firstInLine.deliveryMethod === 'direct') {
        this.deliverViaDirect(firstInLine, jpeg)
      } else {
        console.log('Unknown delivery method.')
        this.updateLetterStatus(firstInLine._id, 'failed', { error: 'Método de entrega desconhecido' })
      }
    })

    const nextInterval = randomInterval(INTERVALS[method].MIN_INTERVAL, INTERVALS[method].MAX_INTERVAL)
    console.log(`Next ${method} letter will be delivered in ~${Math.round(nextInterval)} minutes`)
    setTimeout(() => {
      this.deliverNextLetter(method)
    }, nextInterval * 60 * 1000)
  }

  deliverViaFeed(letter, jpeg) {
    console.log('Posting photo')
    this.instagram.publish.photo({
      file: jpeg,
      caption: `De ${TextUtils.getPersonDisplayName(letter.sender)} para ${TextUtils.getPersonDisplayName(letter.recipient)}`
    }).then(res => {
      if (res.status === 'ok') {
        console.log(`Posted successfully!`)
        this.updateLetterStatus(letter._id, 'delivered', { instagramPostCode: res.media.code })
      } else {
        console.error('Error while posting to feed. Failed', res)
        this.updateLetterStatus(letter._id, 'failed', { error: 'Um erro ocorreu ao postar a foto no feed' })
      }
    }).catch(err => {
      console.error('Error while posting to feed. Failed', err)
      this.updateLetterStatus(letter._id, 'failed', { error: 'Um erro ocorreu ao postar a foto no feed' })
    })
  }

  async deliverViaDirect(letter, jpeg) {
    console.log('Sending photo via direct')
    this.instagram.user.getIdByUsername(letter.recipient.instagram).then(recipientId => {
      const thread = this.instagram.entity.directThread([recipientId.toString()])
      thread.broadcastPhoto({
        file: jpeg
      }).then(res => {
        if (res.item_id) {
          console.log(`Direct sent successfully!`)
          this.updateLetterStatus(letter._id, 'delivered', { instagramThreadId: res.thread_id, instagramItemId: res.item_id })
          thread.broadcastText(`De ${TextUtils.getPersonDisplayName(letter.sender)} para ${TextUtils.getPersonDisplayName(letter.recipient)}`)
        } else {
          console.log('Instagram did not return an item_id. Failed.')
          this.updateLetterStatus(letter._id, 'failed', { error: 'O instagram não retornou o ID da mensagem' })
        }
      }).catch(err => {
        console.error('Error while sending direct. Failed', err)
        this.updateLetterStatus(letter._id, 'failed', { error: 'Um erro ocorreu ao enviar a foto via direct' })
      })
    }).catch(err => {
      console.error('Error while finding user', err)
      this.updateLetterStatus(letter._id, 'failed', { error: 'Usuário não encontrado' })
    })
  }

  updateLetterStatus(letterId, status, extras = {}) {
    return this.letterCollection.updateOne({ _id: new ObjectId(letterId) }, {
      $set: {
        status: status,
        ...extras
      }
    })
  }
}