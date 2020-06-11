const { MongoClient } = require('mongodb')

const ExpressServer = require('./ExpressServer.js')
const InstagramBot = require('./InstagramBot.js')

const mongo = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true })

console.log('Initializing!')

mongo.connect(err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.info('Connected to the database successfully.')
  const database = mongo.db('correioelegante')

  ExpressServer.initialize(database)
  if (process.env.INSTAGRAM_USERNAME && process.env.INSTAGRAM_PASSWORD) {
    const bot = new InstagramBot(database).initialize()
  } else {
    console.info('Instagram bot not initialized due to missing environment variables.')
  }
})