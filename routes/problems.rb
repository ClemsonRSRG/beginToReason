# Handles everything to do with the problems.

require 'sinatra'
require 'mongo'

set :bind, '0.0.0.0'

# Description of the problem
get '/problems/:module/:problem' do
	problems = settings.mongo[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	problem.to_json
end

# Code of the problem
get '/problems/:module/:problem/code' do
	problems = settings.mongo[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	projection = {'code' => 1, '_id' => 0}
	problem = problems.find(filter, projection).limit(1).first
	
	problem['code']
end

# Description of the previous problem
get '/problems/:module/:problem/previous' do
	problems = settings.mongo[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['previous']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Description of the next problem on success
get '/problems/:module/:problem/success' do
	problems = settings.mongo[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['success']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Description of the next problem on failure
get '/problems/:module/:problem/failure' do
	problems = settings.mongo[:problems]

	filter = {'module' => params['module'], 'name' => params['problem']}
	problem = problems.find(filter, problemProjection).limit(1).first
	
	filter = {'module' => params['module'], 'name' => problem['failure']}
	problem = problems.find(filter).limit(1).first

	problem.to_json
end

# Helper functions

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
