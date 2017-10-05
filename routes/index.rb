# This file serves the index file for the various sections. This is not a part
# of the JSON RESTful API, but more of an ever-so-slightly-dynamic file server.
# Hopefully it will become more dynamic in the future.

require 'sinatra'

# The various sections, with randomized words to prevent switching sections
get '/section1dry' do
	@section = 'section1'
	erb :index
end

get '/section2bat' do
	@section = 'section2'
	erb :index
end

get '/section3pop' do
	@section = 'section3'
	erb :index
end

get '/section4red' do
	@section = 'section4'
	erb :index
end
