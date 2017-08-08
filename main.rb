require "sinatra"

set :bind, "0.0.0.0"

get "/" do
	redirect to "/index.html"
end

get "/problems/:section/:problem" do
	# Eventually, read from a relational database like MySQL or document store
	# like Redis. But right now, just serve the file.
	File.read("problems/#{params['section']}/#{params['problem']}")
end
