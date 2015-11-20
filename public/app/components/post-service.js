define(['axios'], function(axios) {
	'use strict;'

	var transformObjectToForm = function(formObject) {
		var builtString = '';

		for(var formEntry in formObject) {
			builtString += encodeURIComponent(formEntry) + '=' + encodeURIComponent(formObject[formEntry]) + '&';
		}

		return builtString.substring(0, builtString.length - 1);
	}

	var PostService = {
		getPosts : function() {
			return new Promise((resolve, reject) => {
				axios.get('/post')
					.then(response => resolve(response.data))
					.catch(response => reject({ status: response.status, data: response.data }));
			});
		},

		savePost : function(data) {
			return new Promise((resolve, reject) => {
				axios.post('/post', transformObjectToForm(data), {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
				.then((response) => resolve(response.data))
				.catch((response) => reject({status: response.status, data: response.data }));
			});
		}
	}

	return PostService;
});