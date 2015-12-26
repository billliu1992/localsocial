from localsocial.database.db import db_conn
from localsocial.model.reply_model import Reply
from localsocial.model.location_model import Location

"""
CREATE TABLE replies (
	replyId			SERIAL PRIMARY KEY,
	postId			INTEGER REFERENCES posts (postId) NOT NULL,
	authorId		INTEGER REFERENCES users (userId) NOT NULL,
	authorName		VARCHAR(60) NOT NULL,
	replyBody		TEXT NOT NULL,
	replyDate		TIMESTAMPTZ,
	cityName		TEXT NOT NULL,

	edited			BOOLEAN NOT NULL
);

self.post_id = post_id
		self.author_id = author_id
		self.author_name = author_name
		self.reply_body = body
		self.reply_date = reply_date
		self.city_name = city_name
		self.edited = edited
"""

def get_replies_by_post_id(post_id):
	cursor = db_conn.cursor()

	cursor.execute("""
		SELECT replyId, postId, authorId, authorName, replyBody, replyDate, cityName, longitude, latitude, edited FROM replies
		WHERE postId=%s;
		""", (post_id,))

	db_conn.commit()

	rows = cursor.fetchall()

	replies = []

	for row in rows:
		(reply_id, post_id, author_id, author_name, reply_body, reply_date, city_name, longitude, latitude, edited) = row

		new_location = Location(city_name, longitude, latitude)

		new_reply = Reply(post_id, author_id, author_name, reply_body, reply_date, new_location, edited)
		new_reply.reply_id = reply_id

		replies.append(new_reply)

	return replies


def create_reply(reply):
	cursor = db_conn.cursor()

	print((reply.post_id, reply.author_id, reply.author_name, reply.reply_body, 
			reply.reply_date, reply.city, reply.longitude, reply.latitude, reply.edited))

	cursor.execute("""
		INSERT INTO replies (postId, authorId, authorName, replyBody, replyDate, cityName, longitude, latitude, edited)
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
		RETURNING replyId;
		""", (reply.post_id, reply.author_id, reply.author_name, reply.reply_body, 
			reply.reply_date, reply.city, reply.longitude, reply.latitude, reply.edited))

	db_conn.commit()

	new_reply_id = cursor.fetchone()[0]

	reply.reply_id = new_reply_id

	return reply



def update_reply(reply):
	if reply.reply_id == -1:
		raise Exception("Need to create reply before updating")

	cursor.execute("""
		UPDATE replies SET
		postId = %s, authorId = %s, authorName = %s, replyBody = %s, 
		replyDate = %s, cityName = %s, longitude = %s, latitude = %s, edited = %s
		WHERE replyId = %s;
		""", (reply.post_id, reply.author_id, reply.author_name, reply.reply_body, 
			reply.reply_date, reply.city, reply.longitude, reply.latitude,
			reply.edited, reply.reply_id))

	db_conn.commit()

	return reply