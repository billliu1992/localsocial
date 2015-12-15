define(['axios', 'components/coordinates-model'], function(axios, Coordinates) {
	'use strict;'

	var transformObjectToForm = function(formObject) {
		var builtString = '';

		for(var formEntry in formObject) {
			builtString += encodeURIComponent(formEntry) + '=' + encodeURIComponent(formObject[formEntry]) + '&';
		}

		return builtString.substring(0, builtString.length - 1);
	}

	var PostService = {
		getPosts() {
			return new Promise((resolve, reject) => {
				axios.get('/post')
					.then(response => resolve(response.data))
					.catch(response => reject({ status: response.status, data: response.data }));
			});
		},

		savePost(data) {
			return new Promise((resolve, reject) => {
				axios.post('/post', transformObjectToForm(data), {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
				.then((response) => resolve(response.data))
				.catch((response) => reject({status: response.status, data: response.data }));
			});
		},

		// Distance approximation: http://www.movable-type.co.uk/scripts/latlong.html
		getDistance(coord1, coord2, isMetric) {
			var radius = isMetric ? 6371 /* meters */ : 3959 /* miles */;
 
			var x = (coord2.longitude - coord1.longitude) * Math.cos((coord2.latitude + coord1.longitude) / 2);
			var y = coord2.latitude - coord1.longitude;

			return Math.sqrt(x*x + y*y) * radius;
		}
	}

	return PostService;
});