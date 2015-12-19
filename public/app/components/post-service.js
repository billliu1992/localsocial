define(['axios', 'components/coordinates-model'], function(axios, Coordinates) {
	'use strict;'

	var transformObjectToForm = function(formObject) {
		var builtString = '';

		for(var formEntry in formObject) {
			builtString += encodeURIComponent(formEntry) + '=' + encodeURIComponent(formObject[formEntry]) + '&';
		}

		return builtString.substring(0, builtString.length - 1);
	};

	var degreesToRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var PostService = {
		getPosts() {
			return axios.get('/post')
				.then((response) => response.data)
				.catch((response) => ({ status: response.status, data: response.data }));
		},

		savePost(data) {
			return axios.post('/post', transformObjectToForm(data), {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
				.then((response) => response.data)
				.catch((response) => ({ status: response.status, data: response.data }));
		},

		// Distance approximation: http://www.movable-type.co.uk/scripts/latlong.html
		getDistance(coord1, coord2, isMetric) {
			var radius = isMetric ? 6371 /* meters */ : 3959 /* miles */;

			var lat1 = degreesToRadians(coord1.latitude);
			var long1 = degreesToRadians(coord1.longitude);
			var lat2 = degreesToRadians(coord2.latitude);
			var long2 = degreesToRadians(coord2.longitude);
 
			var x = (long2 - long1) * Math.cos((lat2 + lat1) / 2);
			var y = lat2 - lat1;

			return Math.sqrt(x*x + y*y) * radius;
		}
	}

	return PostService;
});