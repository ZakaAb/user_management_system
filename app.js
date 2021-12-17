const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const mysql = require('mysql')

require('dotenv').config()

const app = express()

const port = 5000

// Parsing middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

// Static files
app.use(express.static('public'))

// Template Engine
app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

const routes = require('./server/routes/user')

app.use(routes)

// Router
/* app.get('', (req, res) => {
  res.render('home')
}) */

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
