# This file is the entry point for Sinatra. It sets up a few global settings,
# connects to Mongo, then loads the route groups. It also handles the base
# route.

require 'sinatra'
require 'mongo'

require './routes/index.rb'
require './routes/problems.rb'
require './routes/log.rb'

set :bind, '0.0.0.0'

# Connect to Mongo
configure do
        db = Mongo::Client.new(['172.19.48.55:27017'], :database => 'resolve', :user => 'admin', :password => 'R3solveGr0up')
        set :mongo, db
end

# Main page
get '/' do
	redirect to '/section1dry'
end
