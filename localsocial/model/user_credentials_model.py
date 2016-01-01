class UserCredentials:
	def __init__(self, user_id, password_hash, salt):
		self.user_id = user_id
		self.password_hash = password_hash
		self.salt = salt

	def to_json_dict(self):
		raise Exception("Tried to JSONify user credentials. This is not allowed to prevent accidentally sending them out!")