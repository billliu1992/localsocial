from localsocial.database.db import db_conn, handled_execute
from localsocial.model.picture_model import ProfilePicture

def create_profile_picture(profile_pic_obj):
	cursor = handled_execute(db_conn, """
		INSERT INTO profilePictures 
			(uploadedPictureId, setDate)
			VALUES (%s, %s)
			RETURNING profilePictureId;
		""", (profile_pic_obj.uploaded_picture_id, profile_pic_obj.set_date))

	profile_pic_id = cursor.fetchone()[0]

	profile_pic_obj.profile_picture_id = profile_pic_id

	return profile_pic_obj

def get_profile_picture_by_id(picture_id):
	cursor = handled_execute(db_conn, """
		SELECT profilePictureId, uploadedPictureId, setDate FROM profilePictures
		WHERE profilePictureId=%s;
		""", (picture_id,))

	profile_picture = None
	if cursor.rowcount > 0:
		(profile_pic_id, uploaded_pic_id, set_date) = cursor.fetchone()

		profile_picture = ProfilePicture(uploaded_pic_id, set_date)
		profile_picture.profile_picture_id = profile_pic_id

	return profile_picture

def delete_profile_picture_by_id(profile_pic_id):
	cursor = handled_execute(db_conn, """
		DELETE FROM profilePictures WHERE profilePictureId=%s
		""", (profile_pic_id,))

	return True