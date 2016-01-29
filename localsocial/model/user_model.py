from localsocial.service.picture import filesystem_storage_service

class Friendship():
	FRIENDS = "friends"
	PENDING = "pending"
	SENT = "sent"
	NOTHING = "nothing"
	SELF = "self"

class User():
	def __init__(self, email, phone, f_name, l_name, n_name, portrait, portrait_set_date, biography, preferences):
		self.user_id = -1
		self.email = email
		self.phone = phone
		self.first_name = f_name
		self.last_name = l_name
		self.nick_name = n_name
		self.portrait = portrait
		self.portrait_set_date = portrait_set_date
		self.biography = biography
		self.preferences = preferences


	@property
	def full_name(self):
		return self.first_name + " " + self.last_name

	def to_json_dict(self, **kwargs):
		show_private_fields = kwargs.get("private", False)
		build_profile_pic_src = kwargs.get("portrait", True)

		user_dict = None
		portrait_src = filesystem_storage_service.get_cropped_src(self.portrait, self.portrait_set_date, self.user_id)
		if show_private_fields:
			user_dict = self.__dict__

			user_dict["portrait_set_date"] = user_dict["portrait_set_date"].isoformat("T")
			user_dict["preferences"] = self.preferences.to_json_dict()

		else:
			user_dict = {
				"user_id" : self.user_id,
				"first_name" : self.first_name,
				"last_name" : self.last_name,
				"nick_name" : self.nick_name,
				"portrait" : self.portrait,
				"biography" : self.biography
			}

		user_dict["portrait_src"] = portrait_src
		

		return user_dict

class UserCredentials:
	def __init__(self, user_id, password_hash, salt):
		self.user_id = user_id
		self.password_hash = password_hash
		self.salt = salt

	def to_json_dict(self):
		raise Exception("Tried to JSONify user credentials. This is not allowed to prevent accidentally sending them out!")

class UserPreferences:
	def __init__(self, show_last_name, name_search, browser_geo):
		self.show_last_name = show_last_name
		self.name_search = name_search
		self.browser_geo = browser_geo

	def to_json_dict(self):
		return self.__dict__