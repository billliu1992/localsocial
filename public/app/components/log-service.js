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
				var newArguments = arguments;
				newArguments.shift(decorateFilename(this.filename));
				
				console.log.apply(window, newArguments);
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