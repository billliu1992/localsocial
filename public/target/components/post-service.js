'use strict';

define(['axios'], function (axios) {
	'use strict;';

	var transformObjectToForm = function transformObjectToForm(formObject) {
		var builtString = '';

		for (var formEntry in formObject) {
			builtString += encodeURIComponent(formEntry) + '=' + encodeURIComponent(formObject[formEntry]) + '&';
		}

		return builtString.substring(0, builtString.length - 1);
	};

	var PostService = {
		getPosts: function getPosts() {
			return new Promise(function (resolve, reject) {
				axios.get('/post').then(function (response) {
					return resolve(response.data);
				}).catch(function (response) {
					return reject({ status: response.status, data: response.data });
				});
			});
		},

		savePost: function savePost(data) {
			return new Promise(function (resolve, reject) {
				axios.post('/post', transformObjectToForm(data), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (response) {
					return resolve(response.data);
				}).catch(function (response) {
					return reject({ status: response.status, data: response.data });
				});
			});
		}
	};

	return PostService;
});