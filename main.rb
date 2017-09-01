require 'sinatra'
require 'mongo'
require 'websocket-client-simple'

set :bind, '0.0.0.0'

# Redirect
get '/' do
	redirect to '/section1dry'
end

# The various sections
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

# Description of the problem
get '/problems/:module/:problem' do
	problems = client[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	problem.to_json
end

# Code of the problem
get '/problems/:module/:problem/code' do
	problems = client[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	projection = {'code' => 1, '_id' => 0}
	problem = problems.find(filter, projection).limit(1).first
	
	problem['code']
end

# Description of the previous problem
get '/problems/:module/:problem/previous' do
	problems = client[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['previous']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Description of the next problem on success
get '/problems/:module/:problem/success' do
	problems = client[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['success']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Description of the next problem on failure
get '/problems/:module/:problem/failure' do
	problems = client[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['failure']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Helper functions

def client
	Mongo::Client.new(['localhost:27017'], :database => 'resolve', :user => 'admin', :password => 'R3solveGr0up')
end

# If a field does not exist in a document, Mongo does not return it. So, we can
# use the same projection for every problem.
def problemProjection
	{
		'_id' => 0,
		'type' => 1,
		'module' => 1,
		'name' => 1,
		'title' => 1,
		'activity' => 1,
		'referenceMaterial' => 1,
		'screenCapture' => 1,
		'solution' => 1,
		'code' => 1
	}
end

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
