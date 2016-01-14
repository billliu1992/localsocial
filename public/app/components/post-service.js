define([
	'components/api-service',
	'components/coordinates-model',
	'axios'
], function(
	APIService,
	Coordinates,
	axios
) {
	'use strict;'

	var degreesToRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var PostService = {
		getPosts() {
			return APIService.filterResponse(axios.get('/post'))
				.catch((response) => ({ status: response.status, data: response.data }));
		},

		savePost(data) {
			return APIService.filterResponse(
				axios.post('/post', APIService.transformObjectToForm(data), {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
			).catch((response) => ({ status: response.status, data: response.data }));
		},

		saveReply(postId, data) {
			return APIService.filterResponse(
				axios.post('/post/' + postId + '/reply', APIService.transformObjectToForm(data), {
					headers: {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
			).catch((response) => ({ status: response.status, data: response.data}));
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