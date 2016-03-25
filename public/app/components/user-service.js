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
		.catch((response) => {
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
		getCurrentUserInfo() {
			return userPromise;
		},
		updateCurrentUserInfo(newInfo) {
			return APIService
				.filterResponse(axios.post('/user/me',
					APIService.transformObjectToForm(newInfo))
				).then((result) => {
					this.overwriteCurrentUserInfo(result.user);

					return result;
				}
			);
		},
		replaceCurrentUserInfo(user) {
			userPromise = Promise.resolve(user);

			ListenerService.fireListeners(user);
		},
		overwriteCurrentUserInfo(newUser) {
			userPromise.then((user) => {
				for(var property in newUser) {
					user[property] = newUser[property];
				}

				this.replaceCurrentUserInfo(user);
			});
		},
		setCustomLocation(location) {
			if(!(location instanceof Coordinates)) {
				throw 'Argument must be instance of Coordinates';
			}

			this.location = location;
		},
		getCustomLocation() {
			return this.location;
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
			return APIService.filterResponse(APIService.localGet('/user/' + userId + '/profile'))
				.catch((response) => {
					log.log('Could not get user at', userId, response.status);
				})
		},
		getUserPosts(userId, maxId, page) {
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

			return APIService.filterResponse(APIService.localGet('/user/' + userId + '/posts', options))
				.catch((response) => ({ status: response.status, data: response.data }));
		},
		sendFriendRequest(userId) {
			return axios.post('/user/' + userId + '/friends/request').then(() => true, () => false);
		},
		getFollowers(userId) {
			return APIService.filterResponse(axios.get('/user/' + userId + '/followers'));
		},
		getFollowing(userId) {
			return APIService.filterResponse(axios.get('/user/' + userId + '/following'));
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
			return axios.post('/user/me/image/profile', formData).then((response) => {
				var user = response.data.user;

				this.overwriteCurrentUserInfo(user);

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