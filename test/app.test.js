const app = require('../src/app')
const { API_TOKEN } = require('../src/config')
const { expect } = require('chai')

describe('App', () => {
  it('GET / array of bookmarks', () => {
    return supertest(app)
      .get('/bookmarks')
      .auth(API_TOKEN, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array')
      })
  })
})