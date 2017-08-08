require "sinatra"

set :bind, "0.0.0.0"

get "/" do
	redirect to "/index.html"
end

get "/problems/:section/:module/json" do
	# Eventually, read from a relational database like MySQL or document store
	# like Redis, or build them dynamically. But right now, just serve the
	# file.
	File.read("problems/#{params['module']}/#{params['problem']}.json")
end

get "/problems/:section/:module/code" do
	# Eventually, read from a relational database like MySQL or document store
	# like Redis, or build them dynamically. But right now, just serve the
	# file.
	File.read("problems/#{params['module']}/#{params['problem']}.code")
end
