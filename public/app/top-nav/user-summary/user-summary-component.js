define([
	'components/user-service',
	'react'
], function(
	UserService,
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
			UserService.getUserProfile().then((profile) => {
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
					<span className="user-name">{ this.state.profile.firstName + ' ' + this.state.profile.lastName }</span>
					
					<div className="user-dropdown">
						<div className="dropdown-option profile">Profile</div>
						<div className="dropdown-option settings">Settings</div>
						<div className="dropdown-option log-out">Log Out</div>
					</div>
				</div>;
			}
		}
	});

	return UserSummary;
});