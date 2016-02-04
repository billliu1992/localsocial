define([
	'axios',
	'components/api-service',
	'components/coordinates-model',
	'components/log-service'
], function(
	axios,
	APIService,
	Coordinates,
	LogService
) {
	'use strict';

	var location = null;

	var log = LogService.createNewLogger('UserService');

	var userPromise = APIService.filterResponse(axios.get('/user/me'))
		.catch((response) => {
			log.log('Could not get user, status: ' + response.status);
		});

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
		getCurrentUserInfo() {
			return userPromise;
		},
		updateCurrentUserInfo(newInfo) {
			var promise = APIService.filterResponse(axios.post('/user/me',
				APIService.transformObjectToForm(newInfo)));

			userPromise = promise.then((result) => {
				return result.user;
			});

			return promise;
		},
		updateCredentials(current, password, confirm) {
			return APIService.filterResponse(axios.post('/user/me/password',
				APIService.transformObjectToForm({ current, password, confirm })));
		},
		updateBiography(biography) {
			return APIService.filterResponse(
				axios.post('/user/me/biography', 
					APIService.transformObjectToForm({
						biography 
					})
				)
			);
		},
		getUserProfile(userId) {
			return APIService.filterResponse(axios.get('/user/' + userId + '/profile'))
				.catch((response) => {
					log.log('Could not get user at ' + userId + response.status);
				})
		},
		sendFriendRequest(userId) {
			return axios.post('/user/' + userId + '/friends/request').then(() => true, () => false);
		},
		sendFollow(userId) {
			return axios.post('/user/' + userId + '/follows/request').then(() => true, () => false);
		},
		deleteFriend(userId) {
			return axios.delete('/user/' + userId + '/friends/request').then(() => true, () => false);
		},
		deleteFollow(userId) {
			return axios.delete('/user/' + userId + '/follows/request').then(() => true, () => false);
		},
		getUserProfilePictureList() {
			return APIService.filterResponse(axios.get('/user/me/image/profile'));
		},
		uploadUserProfilePic(formData) {
			return APIService.filterResponse(axios.post('/user/me/image/profile', formData));
		}
	}

	return UserService;
});