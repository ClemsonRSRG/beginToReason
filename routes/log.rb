# Handles logging the results of the user submissions. Should be merged into
#  the verification route when it gets created.

require 'sinatra'
require 'mongo'

# Log the data
post '/log' do
	data = JSON.parse(request.body.read)
	if (data.key?('type') and data.key?('module') and data.key?('name') and
		data.key?('author') and data.key?('code') and data.key?('time') and data.key?('correct'))

		data['timestamp'] = Time.now.utc.iso8601
		collection = settings.mongo[:data]
		collection.insert_one(data)
		status 200
	else
		status 400
	end
end

