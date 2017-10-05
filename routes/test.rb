require 'sinatra'
require 'sinatra/async'
require 'websocket-client-simple'

register Sinatra::Async

# Test
aget '/test' do
	puts 'Request received'
	b = binding
	
	url = 'wss://resolve.cs.clemson.edu/teaching/Compiler?job=verify2&project=Teaching_Project'
	message = encode('Facility BeginToReason;uses Integer_Ext_Theory;Operation Main();Procedure Var I: Integer;I := 1;Confirm I = 1;end Main;end BeginToReason;')

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
				EM.schedule { b.eval " body 'Success!' " }
			end
		end
		
		ws.on :close do
			puts 'WS closed'
			body 'Closed ...'
		end
		
		puts 'Connecting to WS...'
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

