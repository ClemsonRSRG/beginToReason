# This file is the entry point for Sinatra. It sets up a few global settings
# then loads the route groups. Oh yeah, it also handles the base route.

require 'sinatra'
require 'sinatra/async'

require './routes/index.rb'
require './routes/problems.rb'
require './routes/verify.rb'
require './routes/test.rb'

set :bind, '0.0.0.0'
set :server, 'thin'

register Sinatra::Async

# Redirect
aget '/' do
	redirect to '/section1dry'
end
