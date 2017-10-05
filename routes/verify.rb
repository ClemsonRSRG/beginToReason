require 'sinatra'
require 'sinatra/async'
require 'mongo'
require 'websocket-client-simple'

register Sinatra::Async

# Verify and log an attempt
post '/verify' do
	json = JSON.parse(request.body.read)
	if not json.key?("authorID")
		response = {"success" => false, "message" => "Request body does not contain an authorID field."}
	elsif not json.key?("seconds")
		response = {"success" => false, "message" => "Request body does not contain a milliseconds field."}
	elsif not json.key?("code")
		response = {"success" => false, "message" => "Request body does not contain a code field."}
	else
		puts ''
		puts json['authorID']
		puts json['seconds']
		puts json['code']
		
		response = {"status" => "success", "VCs" => []}
		
		# Correctly formed request, so send it to the verifier
		ws = WebSocket::Client::Simple.connect('wss://resolve.cs.clemson.edu/teaching/Compiler?job=genVCs&project=Teaching_Project')
		
		ws.on :message do |message|
			puts ''
			puts "Message: #{message}"
		end
		
		ws.on :open do
			puts ''
			puts 'Opened the socket'
			
			puts encode(json['code'])
			
			ws.send encode(json['code'])
		end
		
		ws.on :close do |error|
			puts ''
			puts 'The socket is closed.'
			puts "Error message: #{error}"
		end
		
		ws.on :error do |error|
			puts ''
			puts "Error. Message: #{error}"
		end
		
		# Now log it
	end

	response.to_json
end
