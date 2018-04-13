// This file is a template for setting up the application on your local system.
// Start by making a copy of this file called config.js and edit any of settings
// below for your local system. The file is ignored by git so your configurations
// won't be shared with other users.

var config = {}

// port to run on

const port = 3000

// mongo configs

const host = '--- host name or ip address ---'
const db = '--- database name ---'
const user = '--- username ---'
const pass = '--- password ---'

config.uri = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db
config.port = port

module.exports = config

