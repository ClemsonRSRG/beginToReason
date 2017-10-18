# Handles everything to do with the admin page.

require 'sinatra'

# The different routes to the different admin subpages.
get '/admin' do
	redirect to '/admin/overview'
end

get '/admin/overview' do
	erb :"admin/overview" , :layout => :"admin/layout"
end