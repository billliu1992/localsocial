from datetime import datetime

from localsocial.model.picture_model import ProfilePicture, PictureSection
from localsocial.database import picture_dao, profile_picture_dao

def get_pictures_by_user(searched_user_id, current_user_id, **kwargs):
	page_num = kwargs.get("page_num", 1)
	post_per_page = kwargs.get("post_per_page", 10)
	max_id = kwargs.get("max_id", None)

	if page_num < 1:
		page_num = 1

	return picture_dao.get_pictures_by_user(searched_user_id, current_user_id, post_per_page, (page_num - 1) * post_per_page, max_id)

def get_picture_by_id(picture_id, current_user_id):
	return picture_dao.get_picture_by_id(picture_id, current_user_id)

def create_picture(picture_obj):
	return picture_dao.create_picture(picture_obj)

def update_picture(picture_obj):
	return picture_dao.update_picture(picture_id)

def delete_picture_by_id(picture_id):
	return picture_dao.delete_picture_by_id(picture_id)

def create_profile_picture(profile_picture_obj):
	return profile_picture_dao.create_profile_picture(profile_picture_obj)

def profile_picture_from_picture(picture_obj, current_user_id, left_bound, top_bound, width, height):
	crop = PictureSection(left_bound, top_bound, width, height)

	return ProfilePicture(picture_obj.picture_id, current_user_id, datetime.now(), crop)