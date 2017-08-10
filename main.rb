require 'sinatra'
require 'mongo'

set :bind, '0.0.0.0'

get "/" do
	redirect to "/index.html"
end

# Description of the problem
get "/problems/:module/:problem" do
	client = Mongo::Client.new(['localhost:27017'], :database => 'resolve', :user => 'admin', :password => 'R3solveGr0up')
	problems = client[:problems]
	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter).limit(1).first
	
	problem.to_json
end

# Code of the problem
get "/problems/:module/:problem/code" do
	File.read("problems/#{params['module']}/#{params['problem']}.code")
end

# Description of the previous problem
get "/problems/:module/:problem/previous" do
	current = File.read("problems/#{params['module']}/#{params['problem']}.code")
	problem = JSON.parse(current)
	File.read("problems/#{problem['module']}/#{problem['previousLesson']}.code")
end

# Description of the next problem on success
get "/problems/:module/:problem/success" do
	current = File.read("problems/#{params['module']}/#{params['problem']}.code")
	problem = JSON.parse(current)
	File.read("problems/#{problem['module']}/#{problem['nextLessonOnSuccess']}.code")
end

# Description of the next problem on failure
get "/problems/:module/:problem/failure" do
	current = File.read("problems/#{params['module']}/#{params['problem']}.code")
	problem = JSON.parse(current)
	File.read("problems/#{problem['module']}/#{problem['nextLessonOnFailure']}.code")
end

