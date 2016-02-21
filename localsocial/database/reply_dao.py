from localsocial.database.db import db_conn, handled_execute
from localsocial.database.util import build_location, build_name
from localsocial.model.reply_model import Reply
from localsocial.model.post_model import POST_PRIVACY
from localsocial.model.location_model import Location

def get_replies_with_post_ids(post_ids, current_user_id):
	cursor = handled_execute(db_conn, """
		SELECT
			replyId, postId, authorId, replyBody, replyDate, cityName, longitude, latitude, privacy, edited,
			firstName, lastName, nickName, portrait, portraitSetDate, showLastName,
			(authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
				AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)) AS areFriends
		FROM replies LEFT JOIN users ON replies.authorId = users.userId
		WHERE postId = ANY(%(post_ids)s)
		ORDER BY replyId ASC;
		""", {"current_user_id" : current_user_id, "post_ids" : post_ids})

	rows = cursor.fetchall()

	replies = []

	for row in rows:
		(reply_id, post_id, author_id, reply_body, reply_date, city_name, longitude, latitude, privacy, edited,
			first_name, last_name, nick_name, portrait, portrait_set_date, show_last_name, are_friends) = row

		author_name = build_name(first_name, nick_name, last_name, are_friends, show_last_name)
		new_location = build_location(longitude, latitude, city_name, are_friends, privacy != POST_PRIVACY.HIDE_LOCATION)

		new_reply = Reply(post_id, author_id, author_name, portrait, portrait_set_date, reply_body, reply_date, new_location, privacy, edited)
		new_reply.reply_id = reply_id

		replies.append(new_reply)

	return replies

def get_replies_by_post_id(post_id, current_user_id):
	cursor = handled_execute(db_conn, """
		SELECT
			replyId, postId, authorId, replyBody, replyDate, cityName, longitude, latitude, privacy, edited,
			firstName, lastName, nickName, portrait, portraitSetDate, showLastName,
			(authorId IN (SELECT firstUserId FROM userFriends WHERE secondUserId = %(current_user_id)s)
				AND %(current_user_id)s IN (SELECT firstUserId FROM userFriends WHERE secondUserId = authorId)) AS areFriends
		FROM replies LEFT JOIN users ON replies.authorId = users.userId
		WHERE postId=%(post_id)s
		ORDER BY replyId ASC;
		""", {"current_user_id" : current_user_id, "post_id" : post_id })

	rows = cursor.fetchall()

	replies = []

	for row in rows:
		(reply_id, post_id, author_id, reply_body, reply_date, city_name, longitude, latitude, privacy, edited,
			first_name, last_name, nick_name, portrait, portrait_set_date, show_last_name, are_friends) = row

		author_name = build_name(first_name, nick_name, last_name, are_friends, show_last_name)
		new_location = build_location(longitude, latitude, city_name, are_friends, privacy != POST_PRIVACY.HIDE_LOCATION)

		new_reply = Reply(post_id, author_id, author_name, portrait, portrait_set_date, reply_body, reply_date, new_location, privacy, edited)
		new_reply.reply_id = reply_id

		replies.append(new_reply)

	return replies


def create_reply(reply):
	cursor = handled_execute(db_conn, """
		INSERT INTO replies (postId, authorId, replyBody, replyDate, cityName, longitude, latitude, privacy, edited)
		VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
		RETURNING replyId;
		""", (reply.post_id, reply.author_id, reply.reply_body, reply.reply_date, reply.city,
			reply.longitude, reply.latitude, reply.privacy, reply.edited))

	new_reply_id = cursor.fetchone()[0]

	reply.reply_id = new_reply_id

	return reply



def update_reply(reply):
	if reply.reply_id == -1:
		raise DAOException("Need to create reply before updating")

	cursor = handled_execute(db_conn, """
		UPDATE replies SET
		postId = %s, authorId = %s, replyBody = %s, replyDate = %s, cityName = %s,
		longitude = %s, latitude = %s, privacy = %s, edited = %s
		WHERE replyId = %s;
		""", (reply.post_id, reply.author_id, reply.author_name, reply.reply_body, 
			reply.reply_date, reply.city, reply.longitude, reply.latitude, reply.privacy,
			reply.edited, reply.reply_id))

	return reply