from localsocial.database.db import db_conn, handled_execute
from localsocial.model.location_model import Location
from localsocial.model.post_model import Post, EventPost, ImagePost

def build_name(first_name, nick_name, last_name, are_friends, show_last_name):
	if (not are_friends) and (not show_last_name):
		last_name = last_name[0:1] + "."

	if nick_name != None:
		author_name = nick_name + " " + last_name
	else:
		author_name = first_name + " " + last_name

	return author_name

def build_location(longitude, latitude, city_name, are_friends, exact_location):
	if (not are_friends) and (not exact_location):
		longitude = None
		latitude = None
		
	return Location(city_name, longitude, latitude)

def get_posts_by_user(searched_user, friends, limit, offset, max_id):
	cursor = handled_execute(db_conn, """
		SELECT
		postId, authorId, postBody, postDate, privacy, cityName, longitude, latitude,
		eventId, eventName, eventLocation, eventStart, eventEnd,
		imageId
		FROM posts
		WHERE authorId=%(searched_user_id)s
			AND (privacy != 'friends' OR %(friends)s = True)
			AND (%(max_id)s IS NULL OR postId < %(max_id)s)
		ORDER BY postId DESC
		LIMIT %(limit)s OFFSET %(offset)s;
		""", { "searched_user_id" : searched_user.user_id, "friends" : friends, "max_id" : max_id, "limit" : limit, "offset" : offset})

	post_rows = cursor.fetchall()

	post_objects = []

	for row in post_rows:
		(post_id, author_id, post_body, post_date, privacy, city_name,
			longitude, latitude, event_id, event_name, event_location, event_start,
			event_end, image_id) = row

		author_name = build_name(searched_user.first_name, searched_user.nick_name, searched_user.last_name, friends, searched_user.preferences.show_last_name)
		post_location = build_location(longitude, latitude, city_name, friends, privacy != 'hide_location')

		if(event_id != None):
			new_post = EventPost(author_id, author_name, searched_user.portrait, post_body, post_date, 
				privacy, post_location, event_id,
				event_name, event_location, event_start, event_end)

		elif(image_id != None):
			new_post = ImagePost(author_id, author_name, searched_user.portrait, post_body, post_date, 
				privacy, post_location, image_id)
		else:
			new_post = Post(author_id, author_name, searched_user.portrait, post_body, post_date, 
				privacy, post_location)

		new_post.post_id = post_id

		post_objects.append(new_post)

	return post_objects


def get_post_feed(current_user_id, current_location, range, limit, skip, max_id=None):
	current_long = current_location.longitude
	current_lat = current_location.latitude

	cursor = handled_execute(db_conn, """
		SELECT
		postId, authorId, postBody, postDate, privacy, cityName, longitude, latitude,
		eventId, eventName, eventLocation, eventStart, eventEnd,
		imageId,
		firstName, lastName, nickName, portrait, showLastName,
		(authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
				AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)) AS areFriends
		FROM posts LEFT JOIN users ON posts.authorId = users.userId
		WHERE sqrt((longitude - %(current_long)s) ^ 2 + (latitude - %(current_lat)s) ^ 2) < %(range)s
			AND (privacy != 'friends' OR authorId=%(current_user_id)s
				OR (authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
					AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)))
			AND (%(max_id)s IS NULL OR postId < %(max_id)s)
		ORDER BY postId DESC
		LIMIT %(limit)s OFFSET %(skip)s;""", {
			"current_long" : current_long, "current_lat" : current_lat, "range" : range, "current_user_id" : current_user_id,
			"max_id" : max_id, "limit" : limit, "skip" : skip
		})

	post_rows = cursor.fetchall()

	post_objects = []

	for row in post_rows:
		(post_id, author_id, post_body, post_date, privacy, city_name,
			longitude, latitude, event_id, event_name, event_location, event_start,
			event_end, image_id, first_name, last_name, nick_name, portrait, show_last_name,
			are_friends) = row

		author_name = build_name(first_name, nick_name, last_name, are_friends, show_last_name)
		post_location = build_location(longitude, latitude, city_name, are_friends, privacy != 'exact_location')

		if(event_id != None):
			new_post = EventPost(author_id, author_name, portrait, post_body, post_date, 
				privacy, post_location, event_id,
				event_name, event_location, event_start, event_end)

		elif(image_id != None):
			new_post = ImagePost(author_id, author_name, portrait, post_body, post_date, 
				privacy, post_location, image_id)
		else:
			new_post = Post(author_id, author_name, portrait, post_body, post_date, 
				privacy, post_location)

		new_post.post_id = post_id

		post_objects.append(new_post)

	return post_objects

def create_post(post):
	cursor = handled_execute(db_conn, """
		INSERT INTO posts 
		(authorId, postBody, postDate, privacy, cityName, longitude, latitude)
		VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING postId;
		""", (post.author_id, post.body, post.post_date, post.privacy, post.city, 
			post.longitude, post.latitude))

	last_id = cursor.fetchone()[0]

	post.post_id = last_id

	return post
