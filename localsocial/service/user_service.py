from localsocial.model.user_model import User
from localsocial.database import user_dao
from localsocial.service import facebook_service

def login_user_facebook(access_token):
	user_info = facebook_service.get_user_info(access_token)

	logged_in_user = user_dao.get_user_by_platform_id("facebook", user_info["id"])

	if logged_in_user == None:
		logged_in_user = User(user_info["first_name"], user_info["last_name"], "", 
			"0", access_token, "", "facebook", user_info["id"])

		logged_in_user = user_dao.create_user(logged_in_user)

	return logged_in_user

def get_user_by_id(user_id):
	return user_dao.get_user_by_id(user_id)