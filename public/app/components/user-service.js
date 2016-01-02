define(['axios', 'components/coordinates-model', 'components/log-service'], function(axios, Coordinates, LogService) {
	'use strict';

	var location = null;

	var userPromise = axios.get('/user/me')
		.then(
			(response) => response.data,
			(response) => {
				LogService.log('Could not get user, status: ' + response.status);
			}
		);

	var UserService = {
		setCustomLocation(location) {
			if(!(location instanceof Coordinates)) {
				throw 'Argument must be instance of Coordinates';
			}

			this.location = location;

		},
		getCustomLocation() {
			return this.location;
		},

		getUserProfile() {
			return userPromise;
		},
		sendFriendRequest(userId) {
			return axios.post('/user/' + userId + '/friends/request').then((response) => true, (response) => false);
		},
		sendFollow(userId) {
			return axios.post('/user/' + userId + '/follows/request').then((response) => true, (response) => false);
		},
		deleteFriend(userId) {
			return axios.delete('/user/' + userId + '/friends/request').then((response) => true, (response) => false);
		},
		deleteFollow(userId) {
			return axios.delete('/user/' + userId + '/follows/request').then((response) => true, (response) => false);
		}

	}

	return UserService;
});