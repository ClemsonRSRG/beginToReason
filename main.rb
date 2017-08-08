require "sinatra"

set :bind, "0.0.0.0"

get "/" do
	redirect to "/index.html"
end

get "/problems/:module/:problem/json" do
	# Eventually, read from a relational database like MySQL or document store
	# like Redis, or build them dynamically. But right now, just serve the
	# file.
	File.read("problems/#{params['module']}/#{params['problem']}.json")
end

get "/problems/:module/:problem/code" do
	# Eventually, read from a relational database like MySQL or document store
	# like Redis, or build them dynamically. But right now, just serve the
	# file.
	File.read("problems/#{params['module']}/#{params['problem']}.code")
end
