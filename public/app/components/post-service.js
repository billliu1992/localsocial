define([
	'components/api-service',
	'components/coordinates-model',
	'components/util',
	'axios'
], function(
	APIService,
	Coordinates,
	Util,
	axios
) {
	'use strict;'

	var degreesToRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};

	var PostService = {
		PRIVACY_SETTINGS : {
			PUBLIC : 'public',
			HIDE_LOCATION : 'hide_location',
			FRIENDS : 'friends'
		},
		getPosts(maxId, page) {
			var options = {};
			if(typeof maxId !== 'undefined' && maxId !== null) {
				if(typeof page === 'undefined' || page === null || page < 1) {
					page = 1;
				}

				options.params = {
					'max_id' : maxId,
					'page' : page
				}
			}

			return APIService.filterResponse(APIService.localGet('/post', options))
				.catch((response) => ({ status: response.status, data: response.data }));
		},
		savePost(data) {
			return APIService.filterResponse(
				APIService.localPost('/post', data, {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
			);
		},
		deletePost(postId) {
			return APIService.filterResponse(
				axios.delete('/post/' + postId)
			);
		},
		saveReply(postId, data) {
			return APIService.filterResponse(
				APIService.localPost('/post/' + postId + '/reply', data, {
					headers: {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				})
			).catch((response) => ({ status: response.status, data: response.data}));
		},
		deleteReply(replyId) {
			return APIService.filterResponse(
				axios.delete('/reply/' + replyId)
			);
		},
		likePost(postId) {
			return APIService.filterResponse(axios.post('/post/' + postId + '/like'));
		},
		unlikePost(postId) {
			return APIService.filterResponse(axios.post('/post/' + postId + '/unlike'));
		},
		buildAnchor(postId) {
			return 'post-' + postId;
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
		},
		formatDistanceForDisplay(postCoords, feedCoords) {
			if(!feedCoords || postCoords.latitude === null || postCoords.longitude === null || feedCoords.city !== postCoords.city) {
				return postCoords.city;
			}
			else {
				var distance = PostService.getDistance(postCoords, feedCoords, true);

				return Util.round(distance, 2) + ' miles away';
			}
		},
		formatTimeForDisplay(time) {
			var currentTime = new Date();

			var difference = currentTime - time;

			var buildString = function(diff, oneUnitInMillis, unitName) {
				var numberOfUnits = Math.floor(diff / oneUnitInMillis);
				if(numberOfUnits > 1) {
					unitName += 's';
				}

				return numberOfUnits + ' ' + unitName + ' ago';
			}

			if(difference / (1000 * 60 * 60 * 24 * 365) >= 1) {
				return buildString(difference, (1000 * 60 * 60 * 24 * 365), "year");
			}
			else if(difference / (1000 * 60 * 60 * 24 * 30) >= 1) {
				// We naively assume each month is 30 days
				return buildString(difference, (1000 * 60 * 60 * 24 * 30), "month");
			}
			else if(difference / (1000 * 60 * 60 * 24) >= 1) {
				return buildString(difference, (1000 * 60 * 60 * 24), "day");
			}
			else if(difference / (1000 * 60 * 60) >= 1) {
				return buildString(difference, (1000 * 60 * 60), "hour");
			}
			else if(difference / (1000 * 60 * 60) >= 1) {
				return buildString(difference, (1000 * 60), "minute");
			}
			else {
				return "less than a minute ago";
			}
		},
		formatPrivacyForDisplay(privacyString) {
			if(privacyString === 'friends') {
				return 'Private';
			}
		}
	}

	return PostService;
});