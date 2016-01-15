define([
	'profile-popup/profile-popup-component',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
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
		},
		render() {
			if(this.state.profile === null) {
				return <div className="user-summary loading"></div>;
			}
			else {
				return <div className="user-summary">
					<img src="/portrait/test" />
					<span className="user-name">{ this.state.profile['first_name'] + ' ' + this.state.profile['last_name'] }</span>
					
					<div className="user-dropdown">
						<div className="dropdown-option profile" onClick={this.showProfilePopup}>Profile</div>
						<div className="dropdown-option settings">Settings</div>
						<div className="dropdown-option log-out">Log Out</div>
					</div>
				</div>;
			}
		},
		showProfilePopup() {
			PopupService.showPopup(ProfilePopup, { userId : 'me' });
		}
	});

	return UserSummary;
});