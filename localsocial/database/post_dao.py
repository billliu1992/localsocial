from localsocial.database.db import db_conn, handled_execute
from localsocial.model.location_model import Location
from localsocial.model.post_model import Post, EventPost, ImagePost

"""
-- General post values
postId			SERIAL PRIMARY KEY,
authorId		REFERENCES users (userId) NOT NULL,
postBody		TEXT NOT NULL,
privacy			privacyValues NOT NULL,
cityName		VARCHAR(50) NOT NULL,
longitude		DOUBLE PRECISION NOT NULL,
latitude		DOUBLE PRECISION NOT NULL,

-- Event values
eventName		VARCHAR(100) NOT NULL,
eventLocation	VARCHAR(200) NOT NULL,
eventStart		TIMESTAMPTZ,
eventEnd		TIMESTAMPTZ,

-- Image values
imageId			VARCHAR(30)

self.author_id = author_id
self.body = body
self.post_date = post_date
self.privacy = privacy
self.city_name = loc_name
self.longitude = loc_long
self.latitutde = loc_lat

self.event_name = event_name
		self.event_location = event_location
		self.event_start = event_start
		self.event_end = event_end

self.picture_id = picture_id
"""

def get_post_feed(current_location, range, limit, skip, max_id=None):
	current_long = current_location.longitude
	current_lat = current_location.latitude

	if(max_id == None):
		cursor = handled_execute(db_conn, """
			SELECT
			postId, authorId, authorName, postBody, postDate, privacy, cityName, longitude, latitude,
			eventId, eventName, eventLocation, eventStart, eventEnd,
			imageId
			FROM posts
			WHERE sqrt((longitude - %s) ^ 2 + (latitude - %s) ^ 2) < %s
			ORDER BY postId DESC
			LIMIT %s OFFSET %s;""", (current_long, current_lat, range, limit, skip)) 
	else:
		cursor = handled_execute(db_conn, """
			SELECT
			postId, authorId, authorName, postBody, postDate, privacy, cityName, longitude, latitude,
			eventId, eventName, eventLocation, eventStart, eventEnd,
			imageId
			FROM posts
			WHERE sqrt((longitude - %s) ^ 2 + (latitude - %s) ^ 2) < %s AND postId < %s
			ORDER BY postId DESC
			LIMIT %s OFFSET %s;""", (current_long, current_lat, range, max_id, limit, skip))

	post_rows = cursor.fetchall()

	post_objects = []

	for row in post_rows:
		(post_id, author_id, author_name, post_body, post_date, privacy, city_name,
			longitude, latitude, event_id, event_name, event_location, event_start,
			event_end, image_id) = row

		post_location = Location(city_name, longitude, latitude)

		if(event_id != None):
			new_post = EventPost(author_id, author_name, post_body, post_date, 
				privacy, post_location, event_id,
				event_name, event_location, event_start, event_end)

		elif(image_id != None):
			new_post = ImagePost(author_id, author_name, post_body, post_date, 
				privacy, post_location, image_id)
		else:
			new_post = Post(author_id, author_name, post_body, post_date, 
				privacy, post_location)

		new_post.post_id = post_id

		post_objects.append(new_post)

	return post_objects

def get_posts(limit, skip, max_id=None):
	if(max_id == None):
		cursor = handled_execute(db_conn, """
			SELECT 
			postId, authorId, authorName, postBody, postDate, privacy, cityName, longitude, latitude,
			eventId, eventName, eventLocation, eventStart, eventEnd,
			imageId
			FROM posts
			ORDER BY postId DESC LIMIT %s OFFSET %s;""", (limit, skip))
	else:
		cursor = handled_execute(db_conn, """
			SELECT 
			postId, authorId, authorName, postBody, postDate, privacy, cityName, longitude, latitude,
			eventId, eventName, eventLocation, eventStart, eventEnd,
			imageId
			FROM posts WHERE postId <= %s ORDER BY postId DESC LIMIT %s OFFSET %s;""", (max_id, limit, skip))

	post_rows = cursor.fetchall()

	post_objects = []

	for row in post_rows:
		(post_id, author_id, author_name, post_body, post_date, privacy, city_name,
			longitude, latitude, event_id, event_name, event_location, event_start,
			event_end, image_id) = row

		post_location = Location(city_name, longitude, latitude)

		if(event_id != None):
			new_post = EventPost(author_id, author_name, post_body, post_date, 
				privacy, post_location, event_id,
				event_name, event_location, event_start, event_end)

		elif(image_id != None):
			new_post = ImagePost(author_id, author_name, post_body, post_date, 
				privacy, post_location, image_id)
		else:
			new_post = Post(author_id, author_name, post_body, post_date, 
				privacy, post_location)

		new_post.post_id = post_id

		post_objects.append(new_post)

	return post_objects

def create_post(post):
	cursor = handled_execute(db_conn, """
		INSERT INTO posts 
		(authorId, authorName, postBody, postDate, privacy, cityName, longitude, latitude)
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING postId;
		""", (post.author_id, post.author_name, post.body, post.post_date, post.privacy, post.city, 
			post.longitude, post.latitude))

	last_id = cursor.fetchone()[0]

	post.post_id = last_id

	return post
