require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const logger = require('./logger')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, API_TOKEN } = require('./config')
const bookmarksRouter = require('./bookmarksRouter')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';


function validateBearerToken(req, res, next) {
  const token = req.get('Authorization') || ''
  if (!token.startsWith('Bearer ')) {
    logger.error(`Unauthorized request to path: ${req.path}`)
    return res.status(401).json({ message: 'Missing or Malformed Authorization Header' })
  }
  if (token.split(' ')[1] !== API_TOKEN) {
    logger.error(`Invalid credentials provided to path: ${req.path}`)
    return res.status(401).json({ message: 'Invalid Credentials' })
  }
  next()
}

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)
app.use(express.json())
app.use('/bookmarks', bookmarksRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    logger.error(`Server Error occured on path ${req.path}`)
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app