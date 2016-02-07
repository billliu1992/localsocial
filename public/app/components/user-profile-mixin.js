define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	'use strict';

	var UserProfileMixin = {
		getInitialState() {
			return {
				profile : null
			}
		},
		componentWillMount() {
			var updateProfile = (profile) => {
				this.setState({
					profile
				});
			};

			UserService.getCurrentUserInfo().then(updateProfile);
			var destroyListener = UserService.onUpdateCurrentUser(updateProfile);

			this.setState({
				destroyListener
			});
		},
		componentWillUnmount() {
			this.state.destroyListener();
		},
		getUserProfilePic(thumb) {
			if(this.state.profile !== null) {
				return UserService.getUserProfilePic(this.state.profile, thumb);
			}
			else {
				return '';
			}
		}
	};

	return UserProfileMixin;
});