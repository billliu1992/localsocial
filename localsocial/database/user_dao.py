from localsocial.model.user_model import User
from localsocial.database.db import db_conn

"""
	accessToken		VARCHAR(50) NOT NULL,
	accessSecret	VARCHAR(50),
	loginPlatform	platform NOT NULL,
	platformId		VARCHAR(75)

	firstName		VARCHAR(30) NOT NULL,
	lastName		VARCHAR(30) NOT NULL,
	nickName		VARCHAR(30),
	portrait		VARCHAR(30) NOT NULL

		self.first_name = f_name
		self.last_name = l_name
		self.nick_name = n_name
		self.portrait = portrait

		self.access_token = access_token
		self.access_secret = access_secret
		self.login_platform = platform
		self.platform_id = plat_id

	"""

def get_user_by_platform_id(platform, plat_id):
	cursor = db_conn.cursor()

	cursor.execute("""SELECT userId,accessToken,accessSecret,loginPlatform,platformId,
			firstName,lastName,nickName,portrait 
		FROM users WHERE loginPlatform=%s AND platformId=%s;
		""", (platform,plat_id))

	db_conn.commit()

	user_row = cursor.fetchone()

	returned_user = None
	if(user_row != None):
		(user_id, access_token, access_secret, login_platform, platform_id,
			first_name, last_name, nick_name, portrait) = user_row

		returned_user = User(first_name, last_name, nick_name, portrait,
			access_token, access_secret, login_platform, platform_id)

		returned_user.user_id = user_id

	return returned_user

def get_user_by_id(user_id):
	cursor = db_conn.cursor()

	cursor.execute("""SELECT userId,accessToken,accessSecret,loginPlatform,platformId,
			firstName,lastName,nickName,portrait
			FROM users WHERE userId=%s;""", (user_id,))

	db_conn.commit()

	user_row = cursor.fetchone()

	returned_user = None
	if(user_row != None):
		(user_id, access_token, access_secret, login_platform, platform_id,
			first_name, last_name, nick_name, portrait) = user_row

		returned_user = User(first_name, last_name, nick_name, portrait,
			access_token, access_secret, login_platform, platform_id)

		returned_user.user_id = user_id

	return returned_user


def create_user(user_obj):
	cursor = db_conn.cursor()

	cursor.execute("""INSERT INTO users 
		(accessToken, accessSecret, loginPlatform, platformId, firstName, lastName, nickName, portrait) 
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
		RETURNING userId;""",
		(user_obj.access_token, user_obj.access_secret, user_obj.login_platform, user_obj.platform_id,
			user_obj.first_name, user_obj.last_name, user_obj.nick_name, user_obj.portrait))

	db_conn.commit()

	last_id = cursor.fetchone()[0]

	user_obj.id = last_id

	return user_obj

def update_user(user_obj):
	cursor = db_conn.cursor()
	cursor.execute("""UPDATE users SET 
		accessToken=%s,
		accessSecret=%s,
		loginPlatform=%s,
		platformId=%s,
		firstName=%s,
		lastName=%s,
		nickName=%s,
		portrait=%s
		WHERE userId=%s;""",
		(user_obj.access_token, user_obj.access_secret, user_obj.login_platform, user_obj.platform_id,
			user_obj.first_name, user_obj.last_name, user_obj.last_name, user_obj.portrait))

	db_conn.commit()

	last_id = cursor.fetchone()[0]

	return user_obj