from localsocial.service.picture import filesystem_storage_service

class UserSearchEntry(object):
	def __init__(self, user_id, name, portrait, is_following, friend_status):
		self.user_id = user_id
		self.name = name
		self.portrait = portrait
		self.is_following = is_following
		self.friend_status = friend_status

	def to_json_dict(self):
		json_dict = {
			"user_id" : self.user_id,
			"name" : self.name,
			"portrait_src" : filesystem_storage_service.get_cropped_src(self.portrait, self.user_id),
			"is_following" : self.is_following,
			"friend_status" : self.friend_status
		}
		return json_dict