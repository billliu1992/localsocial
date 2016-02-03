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

def get_pictures_by_user(searched_user, friends, **kwargs):
	limit = kwargs.get("limit", 20)
	offset = kwargs.get("offset", 10)
	max_id = kwargs.get("max_id", None)

	cursor = handled_execute(db_conn, """
		SELECT 
			pictureId, authorId, uploadedDate, filename, hashedIdentifier,
			photoTitle, photoDescription, cityName, longitude, latitude, privacy
		FROM pictures
		WHERE authorId=%(author_id)s
			AND (privacy != 'friends' OR %(friends)s = True)
			AND (%(max_id)s IS NULL OR postId < %(max_id)s)
		LIMIT %(limit)s OFFSET %(offset)s
	""", { "author_id" : searched_user.user_id, "friends" : friends, "max_id" : max_id, "limit" : limit, "offset" : offset })

	result_rows = cursor.fetchall()

	picture_objs = []

	for result_row in result_rows:
		(picture_id, author_id, uploaded_date, filename, 
			hashed_name, title, descr, city, longitude, latitude, privacy) = result_row

		taken_location = build_location(longitude, latitude, city_name, friends, privacy != "hide_location")

		picture = Picture(author_id, uploaded_date, filename, hashed_name, taken_location, title, descr, privacy)

		picture_objs.append(picture)

	return picture_objs

def get_picture_by_id(image_id, friends):
	cursor = handled_execute(db_conn, """
		SELECT 
			pictureId, authorId, uploadedDate, filename, hashedIdentifier,
			photoTitle, photoDescription, cityName, longitude, latitude, privacy
		FROM pictures
		WHERE authorId=%(author_id)s
			AND (privacy != 'friends' OR %(friends)s = True)
			AND (%(max_id)s IS NULL OR postId < %(max_id)s)
		LIMIT %(limit)s OFFSET %(offset)s
	""", { "author_id" : searched_user.user_id, "friends" : friends, "max_id" : max_id, "limit" : limit, "offset" : offset })

	result_row = cursor.fetchone()

	picture = None

	if result_row != None:
		(picture_id, author_id, uploaded_date, filename, 
				hashed_name, title, descr, city, longitude, latitude, privacy) = result_row

		taken_location = build_location(longitude, latitude, city_name, friends, privacy != "hide_location")

		picture = Picture(author_id, uploaded_date, filename, hashed_name, taken_location, title, descr, privacy)
		
	return picture

def create_picture(picture_obj):
	
