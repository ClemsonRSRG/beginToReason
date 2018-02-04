// This file is the entry point for Node. It sets up a few global settings,
// connects to Mongo, and loads the route groups. It also handles the base
// route.

// Load libraries
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongo = require('express-mongo-db')

// Set app configs
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(bodyParser.json())

// Connect to Mongo
try {
	var configs = require('./conf/config.js')
	app.use(mongo(configs.uri))
	console.log('Connected to mongo')
} catch (ex) {
	console.log('Could not load configs, or maybe could not connect to mongo:')
	console.log(ex)
	process.exit()
}

// Load routes
var sections = require('./routes/sections.js')
app.use('/section', sections)

var problems = require('./routes/problems.js')
app.use('/problem', problems)

var log = require('./routes/log.js')
app.use('/', log)

var verify = require('./routes/verify.js')
app.use('/', verify)

var admin = require('./routes/admin.js')
app.use('/admin', admin)

// Base route
app.get('/', (req, res) => {
	res.redirect('/section/1dry')
})

// Listen on port 3000
var port = 3000
app.listen(port, () => {
	console.log('Listening on port ' + port + '...')
})
