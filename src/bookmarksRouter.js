const express = require('express')
const bookmarksStore = require('./bookmarksStore')
const { v4: uuid } = require('uuid')
const logger = require('./logger')

const bookmarksRouter = express.Router()

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    return res.status(200).json(bookmarksStore)
  })
  .post((req, res, next) => {
    const { title, url, desc = '', rating = 1 } = req.body
    if (typeof title !== 'string' || title.trim() === '') {
      logger.error(`Title is malformed`);
      res.status(400).json({ message: 'title must be a string & cannot be blank' })
    }
    if (typeof url !== 'string' || url.trim() === '' || !/^https?:\/\//.test(url)) {
      logger.error(`Url is malformed`);
      res.status(400).json({ message: 'url cannot be blank & must start with http(s)://' })
    }
    if (typeof desc !== 'string') {
      logger.error(`Description is not a string`);
      res.status(400).json({ message: 'description must be a string' })
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      logger.error(`Rating is not a number`);
      res.status(400).json({ message: 'rating must be a number between 1 and 5' })
    }
    const id = uuid();
    bookmarksStore.push({
      id,
      title,
      url,
      desc,
      rating
    })
    logger.info(`Bookmark created with id: ${id}`);
    res.status(201).json({ id })
  })

bookmarksRouter
  .route('/:id')
  .get((req, res, next) => {
    const bookmark = bookmarksStore.find(bookmark => bookmark.id === req.params.id)
    if (bookmark) {
      logger.info(`Bookmark retrieved with id: ${req.params.id}`);
      return res.status(200).json(bookmark)
    }
    logger.error(`Invalid bookmark ID on path: ${req.path}`);
    res.status(404).json({ message: 'that bookmark does not exist' })
  })
  .delete((req, res, next) => {
    const bookmark = bookmarksStore.findIndex(bookmark => bookmark.id === req.params.id)
    if (bookmark > -1) {
      bookmarksStore.splice(bookmark, 1)
      logger.info(`Bookmark deleted with id: ${req.params.id}`);
      return res.status(204).end()
    }
    logger.error(`Invalid bookmark ID on path: ${req.path}`);
    res.status(404).json({ message: 'that bookmark does not exist' })
  })

module.exports = bookmarksRouter