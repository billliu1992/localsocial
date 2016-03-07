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

	var preventDefault = function(event) {
		event.preventDefault();
	};

	return React.createClass({
		render() {
			var text = NotificationService['NOTIFICATION_TYPES'][this.props.notification.type];

			var entryClass = '';
			if(!this.props.notification['seen']) {
				entryClass = ' new';
			}

			return <div className={ 'notification-entry' + entryClass } onMouseDown={preventDefault} onMouseUp={preventDefault} onClick={ this.doNotifyAction() }>
				<span className="notification-names">{ this.buildNames(this.props.notification['notification_links']) } </span>
				<span className="notification-text"> { NotificationService['NOTIFICATION_TYPES'][this.props.notification['notify_type']] }</span>
			</div>;
		},
		buildNames(users) {
			if(users.length === 1) {
				var user = users[0];

				return <span className="notification-users">{ this.buildName(user) }</span>;
			}
			else if(users.length === 2) {
				var user1 = users[0];
				var user2 = users[1];

				return <span className="notification-users">{ this.buildName(user1) } and { this.buildName(user2) }</span>;
			}
			else if(users.length > 2) {
				var user1 = users[0];
				var user2 = users[1];

				return <span className="notification-users">{ this.buildName(user1) }, { this.buildName(user2) }, and more</span>;
			}

		},
		buildName(user) {
			return <a onClick={ this.goToProfile(user['user_id']) }>{user.name}</a>
		},
		goToProfile(userId) {
			return (event) => {
				event.stopPropagation();
				PopupService.showPopup(ProfilePopup, {userId});
			};
		},
		doNotifyAction() {
			return () => {
				if(this.props.onEntrySelected) {
					this.props.onEntrySelected();
				}

				NotificationService.doNotificationAction(this.props.notification['notify_type'], this.props.notification['target_id'])
			}
		}
	});
});