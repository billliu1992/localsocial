define([
	'axios',
	'components/api-service',
	'components/coordinates-model',
	'components/location-service',
	'components/log-service'
], function(
	axios,
	APIService,
	Coordinates,
	LocationService,
	LogService
) {
	'use strict';

	var location = null;

	var log = LogService.createNewLogger('UserService');

	var userPromise = APIService.filterResponse(axios.get('/user/me'))
		.then((data) => {
			if(data.preferences.browser_geo) {
				LocationService.doBrowserGeolocation().then(function(browserCoords) {
					UserService.setCustomLocation(browserCoords);
				})
			}
		}, (response) => {
			log.log('Could not get user, status: ' + response.status);
		});

	var ListenerService = {
		listeners : [],
		counter : 0,
		addListener(callback) {
			callback.$$lscounter = this.counter++;

			this.listeners.push(callback);

			return this.removeListener(callback.$$lscounter);
		},
		fireListeners(value) {
			for(var callback of this.listeners) {
				callback(value);
			}
		},
		removeListener(counter) {
			return () => {
				for(var i = 0; i < this.listeners.length; i++) {
					var thisCallback = this.listeners[i];

					if(thisCallback.$$lscounter === counter) {
						this.listeners = this.listeners.splice(i, 1);
					}
				}
			};
		}
	}

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
				ListenerService.fireListeners(result.user);

				return result.user;
			});

			return promise;
		},
		onUpdateCurrentUser(callback) {
			return ListenerService.addListener(callback);
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
			var uploadPromise = axios.post('/user/me/image/profile', formData)

			userPromise = uploadPromise.then((response) => {
				return response.data.user;
			});

			return uploadPromise.then((response) => {
				ListenerService.fireListeners(response.data.user);

				return response.data;
			});
		},
		deleteUserProfilePic() {
			var deletePromise = APIService.filterResponse(axios.delete('/user/me/image/profile'));

			userPromise = deletePromise.then((result) => {
				ListenerService.fireListeners(result.user);

				return result.user;
			});

			return deletePromise;
		},
		getUploadedImages(userId) {
			return APIService.filterResponse(axios.get('/user/' + userId + '/image'));
		}
	}

	return UserService;
});