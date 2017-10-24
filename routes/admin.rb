# Handles everything to do with the admin page.

require 'sinatra'
require 'mongo'

# The different routes to the different admin subpages.
get '/admin' do
	redirect to '/admin/overview'
end

get '/admin/overview' do
	# Compute the different data to be displayed in the overview
	loggedData = settings.mongo[:data]
	@totalUsers = loggedData.distinct( "author" ).length
	@totalEntries = loggedData.count()
	@totalCorrectEntries = loggedData.count( { correct: true } )

	erb :"admin/overview" , :layout => :"admin/layout"
end