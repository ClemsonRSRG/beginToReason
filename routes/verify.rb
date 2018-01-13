require 'sinatra'
require 'sinatra/async'
require 'mongo'
require 'websocket-client-simple'

register Sinatra::Async

# Verify and log an attempt
apost '/verify' do
	json = JSON.parse(request.body.read)
	if not json.key?("authorID")
		result = {"success" => "false", "message" => "Request body does not contain an authorID field."}
		body result.to_s
	elsif not json.key?("milliseconds")
		result = {"success" => "false", "message" => "Request body does not contain a milliseconds field."}
		body result.to_s
	elsif not json.key?("code")
		result = {"success" => "false", "message" => "Request body does not contain a code field."}
		body result.to_s
	else
		puts ''
		puts 'Request received'
		puts json['authorID']
		puts json['milliseconds']
		puts json['code']

		url = 'wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project'
		message = encode(json['code'])

		result = '';
		b = binding

		WebSocket::Client::Simple.connect(url) do |ws|
			ws.on :open do
				puts 'WS open'
				
				ws.send message
				puts 'Sent: ' + message
			end
		
			ws.on :message do |message|
				puts 'Got message:' + message.to_s
				hash = decode(message.to_s)
				if hash['status'] == 'complete'
					puts 'Success!'
					result = {'status' => 'success', 'problem' => 'Coming soon...'}
					result = result.to_s
					EM.schedule { b.eval " body result " }
				end
			end
		
			puts 'Connecting to WS...'
		end
	end
end



# Helper functions

def encode(code)
	# First encode the data for some reason
	content = URI.escape(code)
	
	# Then wrap it in JSON with these parameters
	request = {}
	request['name'] = 'BeginToReason'
	request['pkg'] = 'User'
	request['project'] = 'Teaching_Project'
	request['content'] = content
	request['parent'] = 'undefined'
	request['type'] = 'f'
	
	return request.to_json
end

def decode(response)
	# First unencode the data
	j = URI.unescape(response)
	
	# Then parse it
	json = JSON.parse(response)
	
	return json
end
