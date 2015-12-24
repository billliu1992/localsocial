from localsocial.model.user_model import User
from localsocial.database import user_dao, ext_platform_dao
from localsocial.service import facebook_service, auth_service

def login_user_facebook(access_token):
	user_info = facebook_service.get_user_info(access_token)

	user_id = ext_platform_dao.get_external_link("facebook", user_info["id"])

	logged_in_user = None
	if user_id != None:
		logged_in_user = user_dao.get_user_by_id(user_id)
	else:
		logged_in_user = None

	return logged_in_user

def login(field, password):
	#TODO login by phone
	return login_by_email(field, password)

def login_by_email(email, password):
	credentials = user_dao.get_credentials_by_email(email)

	if auth_service.check_password(password, credentials.password_hash, credentials.salt):
		return credentials.user_id
	else:
		return None

def create_new_user(user_obj, new_password):
	#TODO create user by phone as well
	password_hash, salt = auth_service.hash_password(new_password)

	return user_dao.create_user_by_email(user_obj, password_hash, salt)

def get_user_by_id(user_id):
	return user_dao.get_user_by_id(user_id)