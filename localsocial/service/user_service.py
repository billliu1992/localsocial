"""
Service for operations on users
"""

import re

from localsocial.exceptions import CreateUserException
from localsocial.model.user_model import User, Friendship, UserPreferences
from localsocial.database import user_dao, ext_platform_dao, user_relations_dao
from localsocial.service import facebook_service, auth_service

BIOGRAPHY_MAX_LENGTH = 300
MIN_PASSWORD_LENGTH = 7
VALID_EMAIL_PATTERN = re.compile(r"\w+?@\w+?")

def convert_text_to_num(in_string):
	only_numbers = "".join(char for char in in_string if char.isdecimal())
	if len(only_numbers) == 0:
		return None
	else:
		return int(only_numbers)

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

def create_new_user(user, new_password, confirm_password):
	"""
	Create a new user. Throws exceptions if the provided information is incorrect

	Returns the result of the user creation
	"""

	validate_user(user)
	validate_password(new_password, confirm_password)

	#TODO create user by phone as well
	password_hash, salt = auth_service.hash_password(new_password)

	return user_dao.create_user_by_email(user, password_hash, salt)

def validate_user(user):
	"""
	Given a user object, make sure all fields are valid. Throws a CreateUserException
	if not.
	"""
	if user.email == None or VALID_EMAIL_PATTERN.search(user.email) == None:
		raise CreateUserException("Please provide a valid e-mail")
	if user.first_name == None or len(user.first_name) < 1:
		raise CreateUserException("Please provide a first name")
	if user.last_name == None or len(user.last_name) < 1:
		raise CreateUserException("Please provide a last name")

def validate_password(password, confirm):
	"""
	Check the password and confirm password input to see if they are correct.
	If anything from user input is incorrect, a CreateUserException is thrown

	Validation needs to be handled by exceptions, this method returns nothing.
	"""
	if password != confirm:
		raise CreateUserException("Passwords do not match")
	if len(password) < MIN_PASSWORD_LENGTH:
		raise CreateUserException("Password is too short, needs to be " + str(MIN_PASSWORD_LENGTH) + " characters long")

def get_user_by_id(user_id):
	return user_dao.get_user_by_id(user_id)

def get_users_by_ids(user_ids):
	if(len(user_ids) < 1):
		return []
	else:
		return user_dao.get_users_by_ids(user_ids)

def update_user(user_obj):
	return user_dao.update_user(user_obj)

def update_user_credentials(user_obj, old_password, new_password):
	credentials = user_dao.get_credentials_by_email(user_obj.email)

	if auth_service.check_password(old_password, credentials.password_hash, credentials.salt):
		hashed, salt = auth_service.hash_password(new_password)

		return user_dao.update_user_credentials(user_obj, hashed, salt)
	else:
		return False


def set_user_biography(user_obj, new_biography):
	if(len(new_biography) > BIOGRAPHY_MAX_LENGTH):
		return False
	else:
		return user_dao.update_user_biography(user_obj, new_biography)

def get_friendship_status(user_id1, user_id2):
	if user_id1 == user_id2:
		return Friendship.SELF
	
	return user_relations_dao.get_friendship_status(user_id1, user_id2)

def get_following(user_id, ids_only=False):
	return user_relations_dao.get_follows(user_id, ids_only=ids_only)

def get_followers(user_id, ids_only=False):
	return user_relations_dao.get_follows(user_id, reverse=True, ids_only=ids_only)

def get_friends(user_id, ids_only=False):
	return user_relations_dao.get_friends(user_id, mutual=True, ids_only=ids_only)

def get_friend_requests_pending(user_id, ids_only=False):
	return user_relations_dao.get_friends(user_id, reverse=True, not_mutual=True, ids_only=ids_only)

def get_friend_requests_sent(user_id, ids_only=False):
	return user_relations_dao.get_friends(user_id, not_mutual=True, ids_only=ids_only)

def create_follow(requester_id, requested_id):
	return user_relations_dao.create_follow(requester_id, requested_id)

def create_friend(requester_id, requested_id):
	return user_relations_dao.create_friend(requester_id, requested_id)

def delete_follow(requester_id, requested_id):
	return user_relations_dao.delete_follow(requester_id, requested_id)

def delete_friend(requester_id, requested_id):
	return user_relations_dao.delete_friend(requester_id, requested_id) and user_relations_dao.delete_friend(requested_id, requester_id)