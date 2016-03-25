define([
	'components/location-service',
	'axios'
], function(
	LocationService,
	Axios
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
			LocationService.getLocation(useCache).then((position) => {
				if(position !== null) {
					if(!httpConfig) {
						httpConfig = {};
					}
					if(!httpConfig.params) {
						httpConfig.params = {};
					}
					for(attr in position) {
						httpConfig.params[attr] = position[attr];
					}
				}

				return axios.get(url, httpConfig);
			});
		},
		localPost(url, data, httpConfig, useCache = false) {
			LocationService.getLocation(useCache).then((position) => {
				if(position !== null) {
					if(!data) {
						data = {};
					}
					for(attr in position) {
						data[attr] = position[attr];
					}
				}

				return axios.post(url, data, httpConfig);
			});
		}
	};

	return APIService;
});