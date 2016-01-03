class UserSearchEntry(object):
	def __init__(self, user_id, name, portrait, is_following, friend_status):
		self.user_id = user_id
		self.name = name
		self.portrait = portrait
		self.is_following = is_following
		self.friend_status = friend_status

	def to_json_dict(self):
		return self.__dict__