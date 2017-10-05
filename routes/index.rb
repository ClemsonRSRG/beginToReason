# This file serves the index file for the various sections. This is not a part
# of the JSON RESTful API, but more of an ever-so-slightly-dynamic file server.
# Hopefully it will become much more dynamic in the future.

require 'sinatra'
require 'sinatra/async'

register Sinatra::Async

# The various sections
aget '/section1dry' do
	@section = 'section1'
	body erb :index
end

aget '/section2bat' do
	@section = 'section2'
	body erb :index
end

aget '/section3pop' do
	@section = 'section3'
	body erb :index
end

aget '/section4red' do
	@section = 'section4'
	body erb :index
end
