// This file is a template for setting up the application on your local system.
// Start by making a copy of this file called config.js and edit any of settings
// below for your local system. The file is ignored by git so your configurations
// won't be shared with other users.

var config = {}

// mongo configs

var host = '--- host name or ip address ---'
var db = '--- database name ---'
var user = '--- username ---'
var pass = '--- password ---'

config.uri = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db

module.exports = config

