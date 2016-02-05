define([
	'settings-popup/settings-popup-component',
	'profile-popup/profile-popup-component',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
	SettingsPopup,
	ProfilePopup,
	UserService,
	PopupService,
	React
) {
	var UserSummary = React.createClass({
		getInitialState() {
			return {
				profile : null,
				showDropdown : false
			}
		},
		componentWillMount() {
			UserService.getCurrentUserInfo().then((profile) => {
				this.setState({
					profile
				});
			});

			var destroyListener = UserService.onUpdateCurrentUser((profile) => {
				this.setState({
					profile
				});
			});

			this.setState({
				destroyListener
			});
		},
		componentWillUnmount() {
			this.state.destroyListener();
		},
		render() {
			if(this.state.profile === null) {
				return <div className="user-summary loading"></div>;
			}
			else {
				return <div className="user-summary">
					<img src={UserService.getUserProfilePic(this.state.profile, true)} />
					<span className="user-name">{ this.state.profile['first_name'] + ' ' + this.state.profile['last_name'] }</span>
					
					<div className="user-dropdown">
						<div className="dropdown-option profile" onClick={this.showProfilePopup}>Profile</div>
						<div className="dropdown-option settings" onClick={this.showSettingsPopup}>Settings</div>
						<div className="dropdown-option log-out">Log Out</div>
					</div>
				</div>;
			}
		},
		showProfilePopup() {
			PopupService.showPopup(ProfilePopup, { userId : 'me' });
		},
		showSettingsPopup() {
			PopupService.showPopup(SettingsPopup, { userId : 'me' });
		}
	});

	return UserSummary;
});