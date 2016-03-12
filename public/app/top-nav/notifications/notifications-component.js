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
				return <NotificationEntry key={notification['notification_id']} notification={notification} />
			});
			
			return <div className="notification-area">
				<div className="notifications-toggle">Notifications</div>
				<div className="notifications">{ notificationElems }</div>
			</div>;
		},
		showNotifications() {
			this.setState({
				showNoti
	});

	return Notifications;
});