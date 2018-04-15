// This file is the entry point for Node. It sets up a few global settings,
// connects to Mongo, and loads the route groups. It also handles the base
// route.

// Load libraries
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongo = require('express-mongo-db')

// Load configs
try {
    var configs = require('./conf/config.js')
} catch (ex) {
    console.error('Could not load configs. Did you forget to create them?')
    console.error(ex)
    process.exit()
}

// Set app configs
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(bodyParser.json())

// Connect to Mongo
try {
    app.use(mongo(configs.uri))
    console.info('Connected to mongo')
} catch (ex) {
    console.error('Could not connect to mongo:')
    console.error(ex)
    process.exit()
}

// Load routes
var sections = require('./routes/sections.js')
app.use('/section', sections)

var verify = require('./routes/verify.js')
app.use('/', verify)

var admin = require('./routes/admin.js')
app.use('/admin', admin)

// Base route
app.get('/', (req, res) => {
    res.redirect('/section/1dry')
})

// Listen on port in the configs
app.listen(configs.port, () => {
    console.info('Listening on port ' + configs.port + '...')
})
