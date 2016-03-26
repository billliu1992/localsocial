define([
	'components/location-service',
	'axios'
], function(
	LocationService,
	axios
) {
	'use strict';

	var APIService = {
		transformObjectToForm(formObject) {
			var builtString = '';

			for(var formEntry in formObject) {
				builtString += encodeURIComponent(formEntry) + '=' + encodeURIComponent(formObject[formEntry]) + '&';
			}

			return builtString.substring(0, builtString.length - 1);
		},
		filterResponse(responsePromise) {
			return responsePromise.then((response) => {
				return response.data
			});
		},
		localGet(url, httpConfig, useCache = true) {
			return LocationService.getLocation(useCache).then((position) => {
				if(position !== null) {
					if(!httpConfig) {
						httpConfig = {};
					}
					if(!httpConfig.params) {
						httpConfig.params = {};
					}
					for(var attr in position) {
						httpConfig.params[attr] = position[attr];
					}
				}

				return axios.get(url, httpConfig);
			});
		},
		localPost(url, data, httpConfig, useCache = false) {
			return LocationService.getLocation(useCache).then((position) => {
				if(position !== null) {
					if(!data) {
						data = {};
					}
					for(var attr in position) {
						data[attr] = position[attr];
					}
				}

				// TODO: move url encoding out of here, in case we switch to JSON
				var encodedData = APIService.transformObjectToForm(data)

				return axios.post(url, encodedData, httpConfig);
			});
		}
	};

	return APIService;
});