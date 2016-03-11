define([
	'top-nav/notifications/notification-entry/notification-entry-component',
	'react'
], function(
	NotificationEntry,
	React
) {
	'use strict';

	var Notifications = React.createClass({
		render() {
			var notificationElems = this.props.notifications.map((notification) => {
				return <NotificationEntry notification={notification} />
			});
			
			return <div className="notifications">{ notificationElems }</div>;
		}
	});

	return Notifications;
});