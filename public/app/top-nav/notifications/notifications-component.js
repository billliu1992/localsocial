define([
	'top-nav/notifications/notification-entry/notification-entry-component',
	'react'
], function(
	NotificationEntry,
	React
) {
	'use strict';

	var Notifications = React.createClass({
		getInitialState() {
			return {
				showNotifications: false
			}
		},
		render() {
			var notificationElems = this.props.notifications.map((notification) => {
				return <NotificationEntry key={notification['notification_id']} notification={notification} />
			});

			var notificationsClass = '';
			if(this.state.showNotifications) {
				notificationsClass = ' show-notifications';
			}
			
			return <div className={ 'notification-area' + notificationsClass }>
				<a href="" className="notifications-toggle" onClick={this.doToggleNotifications} onBlur={this.doHideNotifications}>Notifications</a>
				<div className="notifications" onMouseDown={ (e) => e.preventDefault() } onMouseUp={ (e) => e.preventDefault() }>{ notificationElems }</div>
			</div>;
		},
		doToggleNotifications(event) {
			event.preventDefault();

			this.setState({
				showNotifications: !this.state.showNotifications
			});
		},
		doHideNotifications(event) {
			this.setState({
				showNotifications: false
			});
		}
	});

	return Notifications;
});