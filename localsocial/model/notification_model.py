class NotificationType(object):
	REQUEST_PENDING = 'request_pending'
	REQUEST_ACCEPTED = 'request_accepted'
	FOLLOWER = 'follower'
	REPLIED = 'replied'
	LIKED = 'liked'

class Notification(object):
	def __init__(self, notified_id, notified_date, notify_type, target_id):
		self.notification_id = -1

		self.notified_id = notified_id
		self.notified_date = notified_date
		self.notify_type = notify_type
		self.target_id = target_id

		self.seen = False
		self.notification_links = None

	def to_json_dict(self):
		json_dict = {
			"notification_id" : self.notification_id,
			"notified_id" : self.notified_id,
			"notified_date" : self.notified_date.isoformat("T"),
			"seen" : self.seen,
			"notify_type" : self.notify_type,
			"target_id" : self.target_id,
		}

		if self.notification_links != None:
			notif_link_json = []
			for notification_link in self.notification_links:
				notif_link_json.append(notification_link.to_json_dict())
			json_dict["notification_links"] = notif_link_json

		return json_dict

class NotificationLink(object):
	def __init__(self, notification_id, user_id):
		self.notification_id = notification_id
		self.user_id = user_id

	def to_json_dict(self):
		return {
			"notification_id" : self.notification_id,
			"user_id" : self.user_id
		}