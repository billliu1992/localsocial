from datetime import datetime, timedelta

from localsocial.database import notification_dao
from localsocial.model.notification_model import Notification, NotificationLink, NotificationType

def get_notifications_by_user_id(user_id):
	return notification_dao.get_notifications_by_user_id(user_id)

def acknowledge_notifications(user_id):
	notification_dao.acknowledge_notifications(user_id)
	
	return notification_dao.trim_notifications(user_id, datetime.now() - timedelta(days=30))

def create_notification_for_user(notified_id, notify_type, target_id, notifier_id): 
	if notified_id == notifier_id:
		return False

	notification_id, is_linked = notification_dao.get_notification_existing_id(notified_id, notify_type, target_id, datetime.now() - timedelta(days=7), notifier_id)

	if notify_type == NotificationType.REQUEST_ACCEPTED or notification_id == None:
		new_notification = Notification(notified_id, datetime.now(), notify_type, target_id)
		notification_dao.create_notification(new_notification)

		notification_id = new_notification.notification_id

	if not is_linked:
		new_notification_link = NotificationLink(notification_id, notifier_id)

		notification_dao.create_notification_link(new_notification_link)

	return True