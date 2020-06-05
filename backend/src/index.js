const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const bodyParser = require('body-parser')
const LetterRenderer = require('./LetterRenderer')
const cors = require('cors')
const { nanoid } = require('nanoid')

const PORT = process.env.PORT || 80

const mongo = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true })

mongo.connect(err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.info('Connected to the database successfully.')

  initializeExpress(mongo.db('correioelegante'))
})

function initializeExpress (database) {
  const letterCollection = database.collection('letters')
  const userCollection = database.collection('users')

  const app = express()

  app.use(cors())
  app.use(bodyParser.json())
  
  app.use((req, res, next) => {
    if (req.method === 'POST' && req.path === '/letters') return next()
    if (!req.header('Authorization')) return res.sendStatus(401)
    userCollection.findOne({ token: req.header('Authorization').replace('Bearer ', '') }).then(doc => {
      if (doc) {
        req.user = doc
        return next()
      }
      return res.sendStatus(401)
    }).catch(err => {
      return res.sendStatus(401)
    })
  })

  app.post('/letters', (req, res) => {
    const newDocument = {
      timestamp: Date.now(),
      status: 'waiting_for_approval',
      ...req.body
    }
    letterCollection.insertOne(newDocument).then(() => {
      res.json(newDocument)
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.get('/letters', (req, res) => {
    letterCollection.find(req.query.status ? { status: req.query.status } : {}).toArray(((err, docs) => {
      res.json(docs)
    }))
  })

  app.get('/letters/:letterId', (req, res) => {
    letterCollection.findOne({ _id: new ObjectId(req.params.letterId) }).then(doc => {
      if (doc) return res.json(doc)
      res.sendStatus(404)
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.put('/letters/:letterId', (req, res) => {
    letterCollection.findOne({ _id: new ObjectId(req.params.letterId) }).then(doc => {
      if (doc) {
        if (['approved', 'denied'].includes(doc.status) && req.query.firstTime) {
          res.sendStatus(409)
        } else {
          letterCollection.updateOne({ _id: new ObjectId(req.params.letterId) }, {
            $set: {
              status: req.body.status,
              lastUpdate: {
                timestamp: Date.now(),
                user: req.user
              }
            }
          }).then(async () => {
            res.sendStatus(200)
          }).catch(e => {
            res.sendStatus(500)
          })
        }
      } else {
        res.sendStatus(404)
      }
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.get('/jpeg/', (req, res) => {
    letterCollection.find().toArray(async (err, docs) => {
      const jpeg = await LetterRenderer.render(docs[Math.floor(Math.random() * docs.length)])
      res.setHeader('Content-Type', 'image/jpeg')
      res.send(jpeg)
    })
  })

  app.get('/jpeg/:letterId', (req, res) => {
    letterCollection.findOne({ _id: new ObjectId(req.params.letterId) }).then(async doc => {
      if (doc) {
        const jpeg = await LetterRenderer.render(doc)
        res.setHeader('Content-Type', 'image/jpeg')
        res.send(jpeg)
      } else {
        res.sendStatus(404)
      }
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.get('/users/@me', (req, res) => {
    res.json(req.user)
  })

  app.post('/users', (req, res) => {
    if (!req.user.admin) return res.sendStatus(401)
    if (!req.body.name) return res.sendStatus(400)
    const newUser = {
      name: req.body.name,
      token: nanoid()
    }
    userCollection.insertOne(newUser).then(() => {
      res.json(newUser)
    })
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}