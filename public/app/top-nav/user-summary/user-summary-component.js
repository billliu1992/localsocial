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
						<img src={ this.props.getProfilePic() } />
					</div>
					<span className="user-name">{ this.props.profile['first_name'] + ' ' + this.props.profile['last_name'] }</span>
					
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