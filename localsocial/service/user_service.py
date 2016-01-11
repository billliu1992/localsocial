from localsocial.model.user_model import User, Friendship
from localsocial.database import user_dao, ext_platform_dao, user_relations_dao
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

def get_users_by_ids(user_ids):
	if(len(user_ids) < 1):
		return []
	else:
		return user_dao.get_users_by_ids(user_ids)

def get_friendship_status(user_id1, user_id2):
	if user_id1 == user_id2:
		return Friendship.SELF
	
	return user_relations_dao.get_friendship_status(user_id1, user_id2)

def get_followers(user_id):
	return user_relations_dao.get_follows(user_id)

def get_following(user_id):
	return user_relations_dao.get_follows(user_id, reverse=True)

def get_friends(user_id):
	return user_relations_dao.get_friends(user_id, mutual=True)

def get_friend_requests_pending(user_id):
	return user_relations_dao.get_friends(user_id, reverse=True, not_mutual=True)

def get_friend_requests_sent(user_id):
	return user_relations_dao.get_friends(user_id, not_mutual=True)

def create_follow(requester_id, requested_id):
	return user_relations_dao.create_follow(requester_id, requested_id)

def create_friend(requester_id, requested_id):
	return user_relations_dao.create_friend(requester_id, requested_id)

def delete_follow(requester_id, requested_id):
	return user_relations_dao.delete_follow(requester_id, requested_id)

def delete_friend(requester_id, requested_id):
	return user_relations_dao.delete_friend(requester_id, requested_id) and user_relations_dao.delete_friend(requested_id, requester_id)