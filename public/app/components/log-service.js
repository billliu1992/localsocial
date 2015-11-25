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
				console.apply(window, decorateFilename(this.filename), arguments);
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