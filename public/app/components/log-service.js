define([], function() {
	'use strict';

	var logDebugEnabled = true;

	var decorateFilename = (filename) => '[' + filename + ']';

	var Logger = function(filename) {
		if(typeof filename === 'undefined') {
			throw 'Cannot create a logger with an undefined filename';
		}

		this.filename = filename;
	}

	Logger.prototype = {
		log() {
			if(logDebugEnabled) {
				var newArguments = [decorateFilename(this.filename)];
				for(var argument of arguments) {
					newArguments.push(argument);
				}
				
				console.log.apply(console, newArguments);
			}
		}
	}

	var LogService = {
		createNewLogger(filename) {
			return new Logger(filename);
		},
		setLogEnabled(isEnabled) {
			logDebugEnabled = isEnabled;
		}	
	};

	return LogService;
});