from localsocial.model.user_model import User
from localsocial.model.user_credentials_model import UserCredentials
from localsocial.database.db import db_conn

from psycopg2.extensions import AsIs

"""
	userId			SERIAL PRIMARY KEY,
	hash			VARCHAR(60) NOT NULL,
	salt			VARCHAR(60) NOT NULL,

	email			VARCHAR(60) UNIQUENOT NULL,
	phone			BIGINT CHECK(phone > 0),

	firstName		VARCHAR(30) NOT NULL,
	lastName		VARCHAR(30) NOT NULL,
	nickName		VARCHAR(30),
	portrait		VARCHAR(30)

		self.first_name = f_name
		self.last_name = l_name
		self.nick_name = n_name
		self.portrait = portrait

		self.access_token = access_token
		self.access_secret = access_secret
		self.login_platform = platform
		self.platform_id = plat_id

	"""

def get_user_by_field(field, value):
	cursor = db_conn.cursor()

	cursor.execute("""SELECT userId, email, phone,
			firstName,lastName,nickName,portrait
			FROM users WHERE %s=%s;""", (AsIs(field), value))

	db_conn.commit()

	user_row = cursor.fetchone()

	returned_user = None
	if(user_row != None):
		(user_id, email, phone, first_name, last_name,
			nick_name, portrait) = user_row

		returned_user = User(email, phone, first_name, last_name, nick_name, portrait)

		returned_user.user_id = user_id
	else:
		raise Exception("No user found in database")

	return returned_user

def get_user_by_email(email):
	return get_user_by_field('email', email)

def get_user_by_phone(phone):
	return get_user_by_field('phone', phone)

def get_user_by_id(user_id):
	return get_user_by_field('userId', user_id)


def create_user_by_field(user_obj, field_name, field_value, password_hash, salt):
	cursor = db_conn.cursor()

	cursor.execute("""INSERT INTO users 
		(%s, hash, salt, firstName, lastName, nickName, portrait) 
		VALUES (%s, %s, %s, %s, %s, %s, %s)
		RETURNING userId;""",
		(AsIs(field_name), field_value, password_hash, salt, user_obj.first_name, user_obj.last_name, user_obj.nick_name, user_obj.portrait))

	db_conn.commit()

	last_id = cursor.fetchone()[0]

	user_obj.user_id = last_id

	return user_obj

def create_user_by_email(user_obj, password_hash, salt):
	return create_user_by_field(user_obj, 'email', user_obj.email, password_hash, salt)

def create_user_by_phone(user_obj, password_hash, salt):
	return create_user_by_field(user_obj, 'phone', user_obj.phone, password_hash, salt)

def get_credentials_by_field(field_name, field_value):
	cursor = db_conn.cursor()

	cursor.execute("""SELECT userId, hash, salt from users WHERE %s=%s;
		""",(AsIs(field_name), field_value))

	db_conn.commit()

	row = cursor.fetchone()
	if row != None:
		userId, password_hash, salt = row

		return UserCredentials(userId, password_hash, salt)
	else:
		raise Exception("No user found in database")

def get_credentials_by_email(email):
	return get_credentials_by_field('email', email)

def get_credentials_by_phone(phone):
	return get_credentials_by_field('phone', phone)

def update_user(user_obj):
	cursor = db_conn.cursor()
	cursor.execute("""UPDATE users SET 
		email = %s, phone = %s, firstName = %s, lastName = %s,
		nickName = %s, portrait = %s
		WHERE userId=%s;""",
		(user_obj.email, user_obj.phone, user_obj.first_name, 
			user_obj.last_name, user_obj.last_name, user_obj.nick_name, user_obj.portrait, user_obj.user_id))

	db_conn.commit()

	return user_obj

def update_user_credentials(user_obj, new_hash, new_salt):
	cursor = db_conn.cursor()
	cursor.execute("""UPDATE users SET hash=%s, salt=%s WHERE userId=%s;""",
		(new_hash, new_salt, user_obj.user_id))

	db_conn.commit()

	return user_obj