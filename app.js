// This file is the entry point for Node. It sets up a few global settings,
// connects to Mongo, and loads the route groups. It also handles the base
// route.

// Load libraries
var express = require('express')
var app = express()
// TODO load mongo

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

// Set configs
app.use(express.static('public'))
// TODO load Mongo settings

// Base route
app.get('/', (req, res) => {
	res.redirect('/section1dry')
})

// Listen on port 3000
var port = 3000
app.listen(port, () => {
	console.log('Listening on port ' + port + '...')
})
