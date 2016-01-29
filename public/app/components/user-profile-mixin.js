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
		getProfilePic() {
			if(this.state.profile) {
				return this.state.profile['portrait_src'];
			}
			else {
				return '';
			}
		}
	};

	return UserProfileMixin;
});