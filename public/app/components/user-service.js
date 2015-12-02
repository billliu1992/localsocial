define(['axios', 'components/coordinates-model'], function(axios, Coordinates) {
	'use strict';

	var UserService = function() {
		this.location = null;	
	}

	UserService.prototype = {
		setCustomLocation(location) {
			if(!(location instanceof Coordinates)) {
				throw 'Argument must be instance of Coordinates';
			}

			this.location = location;

		},
		getCustomLocation() {
			return this.location
		}
	}

	return new UserService;
});