require('dotenv').config()
const express = require('express')
const app = express()
const PORT = 3000
const routes = require('./routes');
app.use(express.json())

app.use('/users', routes.user)
app.use('/snippets', routes.snippet);

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
