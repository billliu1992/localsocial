class Friendship():
	FRIENDS = 'friends'
	PENDING = 'pending'
	SENT = 'sent'
	NOTHING = 'nothing'
	SELF = 'self'

class User():
	def __init__(self, email, phone, f_name, l_name, n_name, portrait, biography):
		self.user_id = -1
		self.email = email
		self.phone = phone
		self.first_name = f_name
		self.last_name = l_name
		self.nick_name = n_name
		self.portrait = portrait
		self.biography = biography


	@property
	def full_name(self):
		return self.first_name + " " + self.last_name

	def to_json_dict(self):
		return {
			"userId" : self.user_id,
			"firstName" : self.first_name,
			"lastName" : self.last_name,
			"nickName" : self.nick_name,
			"portrait" : self.portrait,
			"email" : self.email,
			"phone" : self.phone,
			"biography" : self.biography
		}