const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const bodyParser = require('body-parser')

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

  const app = express()

  app.use(express.static('src/public'))
  app.use(bodyParser.json())

  app.get('/api/letters', (req, res) => {
    letterCollection.find().toArray(((err, docs) => {
      res.json(docs)
    }))
  })

  app.get('/api/letters/:letterId', (req, res) => {
    letterCollection.findOne({ _id: new ObjectId(req.params.letterId) }).then(doc => {
      if (doc) return res.json(doc)
      res.sendStatus(404)
    }).catch(err => {
      res.sendStatus(500)
    })
  })

  app.post('/api/letters', (req, res) => {
    letterCollection.insertOne({
      timestamp: Date.now(),
      ...req.body
    })
    res.sendStatus(200)
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}