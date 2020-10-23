const app = require('./app')
const { PORT, NODE_ENV } = require('./config')

app.listen(PORT, () => {
  console.log(`Server is in ${NODE_ENV} mode & listening on port ${PORT}`)
})