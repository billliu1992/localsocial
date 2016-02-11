define([
	'settings-popup/settings-popup-component',
	'profile-popup/profile-popup-component',
	'components/user-service',
	'components/popup-service',
	'components/user-profile-mixin',
	'react'
], function(
	SettingsPopup,
	ProfilePopup,
	UserService,
	PopupService,
	UserProfileMixin,
	React
) {
	var UserSummary = React.createClass({
		mixins : [UserProfileMixin],
		getInitialState() {
			return {
				showDropdown : false
			}
		},
		render() {
			if(this.state.profile === null) {
				return <div className="user-summary loading"></div>;
			}
			else {
				return <div className="user-summary">
					<div className="portrait-wrap">
						<img src={ this.getProfilePic() } />
					</div>
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