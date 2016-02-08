from localsocial.database.db import db_conn, handled_execute
from localsocial.model.picture_model import ProfilePicture

def create_profile_picture(profile_pic_obj):
	cursor = handled_execute("""
		INSERT INTO profilePictures 
			(uploadedPictureId, userId, setDate, leftBound, topBound, width, height)
			VALUES (%s, %s, %s, %s, %s, %s, %s)
			RETURN profilePictureId;
		""", (profile_pic_obj.uploaded_picture_id, profile_pic_obj.user_id, profile_pic_obj.set_date,
			profile_pic_obj.left_bound, profile_pic_obj.top_bound, profile_pic_obj.width, profile_pic_obj.height))

	profile_pic_id = cursor.fetchone()[0]

	profile_pic_obj.profile_picture_id = profile_pic_id

	return profile_pic_obj

def get_profile_picture_by_picture_id(picture_id):
	cursor = handled_execute("""
		SELECT profilePictureId, uploadedPictureId, userId, setDate, leftBound, topBound, width, height FROM profilePictures
		WHERE uploadedPictureId=%s;
		""", (picture_id,))

	(profile_pic_id, uploaded_pic_id, user_id, set_date, left_bound, top_bound, width, height) = cursor.fetchone()

	profile_picture = ProfilePicture(uploaded_pic_id, user_id, set_date, left_bound, top_bound, width, height)
	profile_picture.profile_picture_id = profile_pic_id

	return profile_picture

def delete_profile_picture_by_id(profile_pic_id):
	cursor = handled_execute("""
		DELETE FROM profilePictures WHERE uploadedPictureId=%s
		""", (profile_pic_id,))

	return True