define([
	'components/popup-service',
	'home-feed/feed/feed-component',
	'components/user-service',
	'react'
], function(
	PopupService,
	Feed,
	UserService,
	React
) {
	var ProfilePopup = React.createClass({
		componentWillMount() {
			var component = this;
			
			UserService.getUserProfile(this.props.userId).then(function(profile) {
				console.log(profile);
				component.setState({ profile });
			});
		},
		render() {
			return <div className="profile">
				<img />
				I got here
			</div>
		}
	});

	return ProfilePopup;
});