define([
	'top-nav/notifications/notification-entry/notification-entry-component',
	'components/notification-service',
	'react'
], function(
	NotificationEntry,
	NotificationService,
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
			var notificationElems = null;
			var newNotifications = 0;
			if(this.props.notifications.length > 0) {
				notificationElems = this.props.notifications.slice(0, 15).map((notification) => {
					if(!notification['seen']) {
						newNotifications++;
					}

					return <NotificationEntry key={notification['notification_id']} notification={notification} onEntrySelected={this.doHideNotifications} />
				});
			}
			else {
				notificationElems = <div className="empty-notifications">
					No notifications to show
				</div>;
			}

			var notificationsClass = 'notification-area';
			if(this.state.showNotifications) {
				notificationsClass += ' show-notifications';
			}
			if(newNotifications > 0) {
				notificationsClass += ' new-notifications';
			}

			var notificationCountElem = null;
			if(newNotifications > 0) {
				notificationCountElem = <span>({newNotifications})</span>
			}
			
			return <div className={ notificationsClass }>
				<a href="" className="notifications-toggle" onClick={this.doToggleNotifications} onBlur={this.doHideNotifications}>
					Notifications {notificationCountElem}
				</a>
				<div className="notifications">{ notificationElems }</div>
			</div>;
		},
		doToggleNotifications(event) {
			event.preventDefault();

			this.setState({
				showNotifications: !this.state.showNotifications
			}, () => {
				if(this.state.showNotifications) {
					NotificationService.acknowledgeNotifications();
				}
			});
		},
		doHideNotifications() {
			this.setState({
				showNotifications: false
			});
		}
	});

	return Notifications;
});