from localsocial.database.db import db_conn, handled_execute
from localsocial.model.notification_model import Notification, NotificationLink

def trim_notifications(user_id, last_date):
	cursor = handled_execute(db_conn, """
		DELETE FROM notifications WHERE notifiedId = %s AND seen = TRUE AND notifiedDate < %s
	""", (user_id, last_date))

	return True

def create_notification(notification):
	cursor = handled_execute(db_conn, """
		INSERT INTO notifications (notifiedId, notifiedDate, seen, notifyType, targetId)
			VALUES (%s, %s, %s, %s, %s)
		RETURNING notificationId;
		""", (notification.notified_id, notification.notified_date, notification.seen,
			notification.notify_type, notification.target_id))

	notification_id = cursor.fetchone()[0]

	notification.notification_id = notification_id

	return notification

def create_notification_link(notification_link):
	cursor = handled_execute(db_conn, """
		INSERT INTO notificationLink (notificationId, userId) VALUES (%s, %s);
	""", (notification_link.notification_id, notification_link.user_id))

	return True

def get_notification_existing_id(notified_id, notify_type, target_id, date, notifier_id):
	cursor = handled_execute(db_conn, """
			SELECT notificationId,
					EXISTS(
						SELECT notificationId FROM notificationLink 
							WHERE notificationLink.notificationId = notifications.notificationId
								AND notificationLink.userId=%s
					) AS isLinked
				FROM notifications
				WHERE notifiedId=%s AND targetId=%s AND seen=FALSE AND notifyType=%s AND notifiedDate > %s
		""", (notifier_id, notified_id, target_id, notify_type, date))

	if cursor.rowcount > 0:
		return cursor.fetchone()
	else:
		return None, False


def get_notifications_by_user_id(user_id):
	cursor = handled_execute(db_conn, """
		SELECT notificationId, notifiedId, notifiedDate, seen, notifyType, targetId FROM notifications
		WHERE notifiedId = %s
	""", (user_id,))

	rows = cursor.fetchall()

	notification_objs = []
	notification_ids = []
	for row in rows:
		(notification_id, notified_id, notified_date, seen, notify_type, target_id) = row

		notification = Notification(notified_id, notified_date, notify_type, target_id)
		notification.notification_id = notification_id
		notification.seen = seen

		notification_objs.append(notification)
		notification_ids.append(notification_id)

	build_notification_links(notification_ids, notification_objs)

	return notification_objs


def build_notification_links(notification_ids, notification_objs):
	cursor = handled_execute(db_conn, """
		SELECT notificationId, userId, 
			FROM notificationLink LEFT JOIN users ON notificationLink.userId = users.userId
		WHERE notificationId = ANY(%s);
	""", (notification_ids,))

	rows = cursor.fetchall()

	notification_links = {}
	for row in rows:
		(notification_id, user_id) = row

		links = notification_links.get(notification_id, [])
		links.append(NotificationLink(notification_id, user_id))
		notification_links[notification_id] = links

	for notification in notification_objs:
		notification.notification_links = notification_links.get(notification.notification_id, [])