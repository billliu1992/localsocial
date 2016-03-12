define([
	'profile-popup/profile-popup-component',
	'components/popup-service',
	'components/notification-service',
	'react'
], function(
	ProfilePopup,
	PopupService,
	NotificationService,
	React
) {
	'use strict';

	return React.createClass({
		render() {
			var text = NotificationService['NOTIFICATION_TYPES'][this.props.notification.type];

			return <div className="notification-entry">
				<span className="notification-names">{ this.buildNames(this.props.notification['notification_links']) }</span>
				{ NotificationService['NOTIFICATION_TYPES'][this.props.notification['notify_type']] }
			</div>;
		},
		buildNames(users) {
			if(users.length === 1) {
				var user = users[0];

				return <div className="notification-users">{ this.buildName(user) }</div>;
			}
			else if(users.length === 1) {
				var user1 = users[0];
				var user2 = users[1];

				return <div className="notification-users">{ this.buildName(user) } and { this.buildName(user) }</div>;
			}
			else if(users.length > 1) {
				var elements = [];
				for(var i = 0; i < users.length - 1; i++) {
					users.push(buildName(users[i]), <span>,</span>);
				}

				var lastUser = users[users.length - 1];
				users.push(<span>and </span>, this.buildName(lastUser));

				return <div className="notification-users">{ users }</div>;
			}

		},
		buildName(user) {
			return <a onClick={ this.goToProfile(user['user_id']) }>{user.name}</a>
		},
		goToProfile(userId) {
			return () => {
				return PopupService.showPopup(ProfilePopup, {userId});
			};
		}
	});
});