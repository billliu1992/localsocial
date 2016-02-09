from db import db_conn, handled_execute

from localsocial.model.picture_model import UploadedPicture
from localsocial.model.location_model import Location

"""
imageId				SERIAL PRIMARY KEY,
	authorId			INTEGER REFERENCES users (userId) NOT NULL,
	uploadedDate		TIMESTAMPTZ NOT NULL,

	filename			TEXT NOT NULL,
	hashedIdentifier	TEXT NOT NULL,

	photoTitle			TEXT,
	photoDescription	TEXT,

	cityName			TEXT NOT NULL,
	longitude			DOUBLE PRECISION NOT NULL,
	latitude			DOUBLE PRECISION NOT NULL,
	privacy				privacyValues NOT NULL,
"""

def build_location(longitude, latitude, city_name, are_friends, exact_location):
	if (not are_friends) and (not exact_location):
		longitude = None
		latitude = None
		
	return Location(city_name, longitude, latitude)

def get_pictures_by_user(searched_user_id, current_user_id, limit, offset, max_id):
	cursor = handled_execute(db_conn, """
		SELECT 
			pictureId, authorId, uploadedDate, filename,
			photoTitle, photoDescription, cityName, longitude, latitude, privacy,
			(authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
				AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)) AS areFriends
		FROM pictures
		WHERE authorId=%(author_id)s
			AND (privacy != 'friends' OR authorId=%(current_user_id)s
				OR (authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
					AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)))
			AND (%(max_id)s IS NULL OR pictureId < %(max_id)s)
		LIMIT %(limit)s OFFSET %(offset)s
	""", { "author_id" : searched_user_id, "current_user_id" : current_user_id, "max_id" : max_id, "limit" : limit, "offset" : offset })

	result_rows = cursor.fetchall()

	picture_objs = []

	for result_row in result_rows:
		(picture_id, author_id, uploaded_date, filename, 
			title, descr, city, longitude, latitude, privacy, friends) = result_row

		taken_location = build_location(longitude, latitude, city, friends, privacy != "hide_location")

		picture = UploadedPicture(author_id, uploaded_date, filename, taken_location, title, descr, privacy)
		picture.picture_id = picture_id

		picture_objs.append(picture)

	return picture_objs

def get_picture_by_id(picture_id, current_user_id):
	cursor = handled_execute(db_conn, """
		SELECT 
			pictureId, authorId, uploadedDate, filename,
			photoTitle, photoDescription, cityName, longitude, latitude, privacy,
			(authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
				AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)) AS areFriends
		FROM pictures
		WHERE pictureId=%(picture_id)s
			AND (privacy != 'friends' OR authorId=%(current_user_id)s
				OR (authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
					AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)))
	""", { "picture_id" : picture_id, "current_user_id" : current_user_id })

	result_row = cursor.fetchone()

	picture = None

	if result_row != None:
		(picture_id, author_id, uploaded_date, filename, 
				title, descr, city, longitude, latitude, privacy, friends) = result_row

		taken_location = build_location(longitude, latitude, city_name, friends, privacy != "hide_location")

		picture = UploadedPicture(author_id, uploaded_date, filename, taken_location, title, descr, privacy)
		picture.picture_id = picture_id
		
	return picture

def create_picture(picture_obj):
	cursor = handled_execute(db_conn, """
		INSERT INTO pictures (authorId, uploadedDate, filename,
			photoTitle, photoDescription, cityName, longitude, latitude, privacy)
			VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
			RETURNING pictureId;
		""", (picture_obj.author_id, picture_obj.uploaded_date, picture_obj.original_filename,
		picture_obj.title, picture_obj.description,
		picture_obj.location.city, picture_obj.location.longitude, picture_obj.location.latitude,
		picture_obj.privacy))

	new_picture_id = cursor.fetchone()[0]

	picture_obj.picture_id = new_picture_id

	return picture_obj

def update_picture(picture_obj):
	cursor = handled_execute(db_conn, """
		UPDATE pictures SET photoTitle=%s, photoDescription=%s, cityName=%s, longitude=%s, latitude=%s, privacy=%s WHERE pictureId=%s
		""", (picture_obj.title, picture_obj.description, picture_obj.location.city, picture_obj.location.longitude,
			picture_obj.location.latitude, picture_obj.privacy, picture_obj.picture_id))

	return picture_obj

def delete_picture_by_id(picture_id):
	cursor = handled_execute(db_conn, """
		DELETE FROM pictures WHERE pictureId=%s
	""", (picture_id,))

	return True