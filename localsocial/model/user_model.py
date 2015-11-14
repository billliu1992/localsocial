class User():
	def __init__(self, f_name, l_name, n_name, portrait, access_token, access_secret, platform, plat_id):
		self.user_id = -1
		self.first_name = f_name
		self.last_name = l_name
		self.nick_name = n_name
		self.portrait = portrait

		self.access_token = access_token
		self.access_secret = access_secret
		self.login_platform = platform
		self.platform_id = plat_id