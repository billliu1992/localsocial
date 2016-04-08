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
	'use strict';

	var UserEntry = React.createClass({
		render() {
			var followElement = false;
			if(this.props.entry['is_following']) {
				followElement = <span className='follow'>Following</span>
			}

			var friendElement = false;
			if(this.props.entry['friend_status'] !== 'none') {
				var friendText = '';
				switch(this.props.entry['friend_status']) {
					case('friends'):
						friendText = 'Friends';
						break;
					case('pending'):
						friendText = 'Accept Friend Request';
						break;
					case('sent'):
						friendText = 'Request Sent';
						break;
				}

				friendElement = <span className='friend'>{friendText}</span>
			}

			var preventDefault = function(event) {
				event.preventDefault();
			};

			return <div className="user-entry" onMouseDown={preventDefault} onMouseUp={this.openProfile}>
				<img src={this.props.entry['portrait_src']} />
				<span className="user-name">{this.props.entry.name}</span>
				<span className="user-info">
					{ followElement }
					{ friendElement }
				</span>
			</div>;
		},
		openProfile(event) {
			PopupService.showPopup(ProfilePopup, { userId : this.props.entry['user_id'] });
			this.props.onClick();
		}
	});

	return UserEntry;
});