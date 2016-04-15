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
	var preventDefault = (event) => event.preventDefault();

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
				var summaryClass = 'user-summary';
				if(this.state.showDropdown) {
					summaryClass += ' shown';
				}

				return <div className={summaryClass}>
					<a href="" onClick={ this.toggleDropdown } onBlur={ this.closeDropdown }>
						<div className="portrait-wrap">
							<img src={ this.props.getProfilePic() } />
						</div>
						<span className="user-name">{ this.props.profile['first_name'] + ' ' + this.props.profile['last_name'] }</span>
					</a>

					<div className="user-dropdown">
						<div className="dropdown-option profile" onMouseDown={preventDefault} onMouseUp={this.showProfilePopup}>Profile</div>
						<div className="dropdown-option settings" onMouseDown={preventDefault} onMouseUp={this.showSettingsPopup}>Settings</div>
						<div className="dropdown-option log-out" onMouseDown={preventDefault} onMouseUp={this.logOut}>Log Out</div>
					</div>
				</div>;
			}
		},
		showProfilePopup() {
			this.closeDropdown();
			PopupService.showPopup(ProfilePopup, { userId : 'me' });
		},
		showSettingsPopup() {
			this.closeDropdown();
			PopupService.showPopup(SettingsPopup, { userId : 'me' });
		},
		toggleDropdown(event) {
			event.preventDefault();

			this.setState({
				showDropdown : !this.state.showDropdown
			});
		},
		closeDropdown() {
			this.setState({
				showDropdown : false
			});
		},
		logOut(event) {
			event.preventDefault();

			UserService.logOut();
		}
	});

	return UserSummary;
});