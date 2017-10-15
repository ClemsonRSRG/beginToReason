# Handles everything to do with the admin page.

require 'sinatra'

# The different routes to the different admin subpages.
get '/admin' do
	redirect to '/admin/dashboard'
end

get '/admin/dashboard' do
	erb :"admin/index"
end