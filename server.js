const express = require('express')
const expressConfig = require('./config/express')
const dotenv = require('dotenv')
const path = require('path')
const history = require('connect-history-api-fallback')

module.exports = () => {
  // Set an express instance
  const app = express()

  // Read the env variables
  dotenv.config({ path: __dirname + '/.env' })

  // Attach middlewares
  expressConfig.attachMiddleWares(app)

  // Import server-routes.
  require('./config/server-routes')(app)

  // Config dist directory
  app.use(express.static('dist'))

  console.log(`Server listening at port: ${app.get('port')}`)
  app.listen(5000)
}
