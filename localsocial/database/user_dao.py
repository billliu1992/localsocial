from localsocial.exceptions import DAOException
from localsocial.model.user_model import User, UserPreferences, UserCredentials
from localsocial.database.db import db_conn, handled_execute

from psycopg2.extensions import AsIs

def get_user_by_field(field, value):
	cursor = handled_execute(db_conn, """
			SELECT userId,email,phone,firstName,lastName,nickName,portrait,biography,
			showLastName,showExactLocation,searchableByName,useBrowserGeolocation
			FROM users WHERE %s=%s;""", (AsIs(field), value))

	user_row = cursor.fetchone()

	returned_user = None
	if(user_row != None):
		(user_id, email, phone, first_name, last_name, nick_name, portrait, biography,
			show_last_name, exact_location, name_search, browser_geo) = user_row

		returned_prefs = UserPreferences(show_last_name, exact_location, name_search, browser_geo)
		returned_user = User(email, phone, first_name, last_name, nick_name, portrait, biography, returned_prefs)

		returned_user.user_id = user_id
	else:
		raise DAOException("No user found in database with field " + str(field) + " with value " + str(value))

	return returned_user

def get_user_by_email(email):
	return get_user_by_field('email', email)

def get_user_by_phone(phone):
	return get_user_by_field('phone', phone)

def get_user_by_id(user_id):
	return get_user_by_field('userId', user_id)

def get_users_by_ids(user_ids):
	cursor = handled_execute(db_conn, """
		SELECT userId,email,phone,firstName,lastName,nickName,portrait,biography,
		showLastName,showExactLocation,searchableByName,useBrowserGeolocation
		FROM users WHERE userId = ANY (%s)""", (user_ids,))

	user_rows = cursor.fetchall()
	user_objs = []
	for row in user_rows:
		(user_id, email, phone, first_name, last_name, nick_name, portrait, biography,
			show_last_name, exact_location, name_search, browser_geo) = row

		user_prefs = UserPreferences(show_last_name, exact_location, name_search, browser_geo)
		user_obj = User(email, phone, first_name, last_name, nick_name, portrait, biography, user_prefs)
		user_obj.user_id = user_id

		user_objs.append(user_obj)

	return user_objs


def create_user_by_field(user_obj, field_name, field_value, password_hash, salt):
	cursor = handled_execute(db_conn, """INSERT INTO users 
		(%s, hash, salt, firstName, lastName, nickName, portrait,
			showLastName, searchableByName, useBrowserGeolocation) 
		VALUES (%s, %s, %s, %s, %s, %s, %s)
		RETURNING userId;""",
		(AsIs(field_name), field_value, password_hash, salt, user_obj.first_name, user_obj.last_name, user_obj.nick_name, user_obj.portrait,
			user_obj.preferences.show_last_name, user_obj.preferences.name_search, user_obj.preferences.browser_geo))

	last_id = cursor.fetchone()[0]

	user_obj.user_id = last_id

	return user_obj

def create_user_by_email(user_obj, password_hash, salt):
	return create_user_by_field(user_obj, 'email', user_obj.email, password_hash, salt)

def create_user_by_phone(user_obj, password_hash, salt):
	return create_user_by_field(user_obj, 'phone', user_obj.phone, password_hash, salt)

def get_credentials_by_field(field_name, field_value):
	cursor = handled_execute(db_conn, """SELECT userId, hash, salt from users WHERE %s=%s;
		""",(AsIs(field_name), field_value))

	row = cursor.fetchone()
	if row != None:
		userId, password_hash, salt = row

		return UserCredentials(userId, password_hash, salt)
	else:
		raise DAOException("No user found in database with field " + str(field_name) + " with value " + str(field_value) + " when searching credentials")

def get_credentials_by_email(email):
	return get_credentials_by_field('email', email)

def get_credentials_by_phone(phone):
	return get_credentials_by_field('phone', phone)

def update_user(user_obj):
	cursor = handled_execute(db_conn, """UPDATE users SET 
		email=%s, phone=%s, firstName=%s, lastName=%s, nickName=%s, portrait=%s,
		showLastName=%s, showExactLocation=%s, searchableByName=%s, useBrowserGeolocation=%s
		WHERE userId=%s;""",
		(user_obj.email, user_obj.phone, user_obj.first_name, user_obj.last_name, user_obj.nick_name,
			user_obj.portrait, user_obj.user_id, user_obj.preferences.show_last_name, user_obj.preferences.exact_location,
			user_obj.preferences.name_search, user_obj.preferences.browser_geo))

	return user_obj

def update_user_credentials(user_obj, new_hash, new_salt):
	cursor = handled_execute(db_conn, """UPDATE users SET hash=%s, salt=%s WHERE userId=%s;""",
		(new_hash, new_salt, user_obj.user_id))

	return user_obj

def update_user_biography(user_obj, new_biography):
	cursor = handled_execute(db_conn, """UPDATE users SET biography=%s WHERE userId=%s""",
		(new_biography, user_obj.user_id))

	return user_obj