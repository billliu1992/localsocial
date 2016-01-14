define([
], function(
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
		}
	};

	return APIService;
});