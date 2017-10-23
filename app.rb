# This file is the entry point for Sinatra. It sets up a few global settings,
# connects to Mongo, and loads the route groups. It also handles the base
# route.

# Library files
require 'sinatra'
require 'sinatra/config_file'
require 'mongo'

# Routes for this application
require './routes/index.rb'
require './routes/problems.rb'
require './routes/log.rb'

# Configurations for the application
configure do
	# General configuration
	set :bind, '0.0.0.0'

	# Check to see if there is a configuration file.
	if File.file?('conf/config.yml')
		# Path to configuration file
		config_file 'conf/config.yml'
		
		# Mongo logger level
		if settings.development?
			# Set Mongo Logger to DEBUG
			Mongo::Logger.logger.level = ::Logger::DEBUG
		else
			# Set Mongo Logger to WARN
			Mongo::Logger.logger.level = ::Logger::WARN
		end
	
		# Mongo configuration
		begin
			db = Mongo::Client.new([settings.db_host], :database => settings.db_table, :user => settings.db_user, :password => settings.db_password, :connect_timeout => 5, :server_selection_timeout => 5)
			set :mongo, db
		rescue Mongo::Error::NoServerAvailable => e
			abort("Error connecting to the database!")
		rescue Mongo::Error => e
   			abort("Error #{e.class}: #{e.message}!")
		end
	else
		abort("Cannot access the configuration file 'conf/config.yml'!")
	end
end

# Main page
get '/' do
	redirect to '/section1dry'
end