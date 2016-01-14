from localsocial.database.db import db_conn, handled_execute
from localsocial.model.search.user_search_entry_model import UserSearchEntry

from psycopg2.extensions import AsIs

def search_user_by_email(current_user_id, email, limit):
	return search_user_by_exact_field(current_user_id, 'email', email, limit)

def search_user_by_phone(current_user_id, phone, limit):
	return search_user_by_exact_field(current_user_id, 'phone', phone, limit)

def search_user_by_exact_field(current_user_id, field, value, limit):
	cursor = handled_execute(db_conn, """
		SELECT userId,firstName,lastName,nickName,portrait,
		(userId IN SELECT secondUserId FROM userFriends WHERE firstUserId=%(current_user)s) AS isRequestSent,
		(userId IN SELECT firstUserId FROM userFriends WHERE secondUserId=%(current_user)s) AS isRequestPending,
		(userId IN SELECT secondUserId FROM userFollows WHERE firstUserId=%(current_user)s) AS isFollowing
		FROM users
		WHERE %(field_name)s=%(value)s
		LIMIT %(limit)s;
		""", {"query" : "%" + query + "%", "limit" : limit, "current_user" : current_user_id, "field_name" : AsIs(field), "value" : value})

	user_rows = cursor.fetchall()

	returned_users = []
	for user_row in user_rows:
		(user_id, first_name, last_name, nick_name,portrait,
			is_request_sent, is_request_pending, is_following) = user_row

		user_friend_status = "none"
		if is_request_sent and is_request_pending:
			user_friend_status = "friends"
		elif is_request_sent:
			user_friend_status = "sent"
		elif is_request_pending:
			user_friend_status = "pending"

		returned_users.append(UserSearchEntry(user_id, first_name + ' ' + last_name, portrait, is_following, user_friend_status))

	return returned_users

def search_user_by_name(current_user_id, query, limit):
	cursor = handled_execute(db_conn, """
		SELECT userId,firstName,lastName,nickName,portrait,
		(userId IN (SELECT secondUserId FROM userFriends WHERE firstUserId=%(current_user)s)) AS isRequestSent,
		(userId IN (SELECT firstUserId FROM userFriends WHERE secondUserId=%(current_user)s)) AS isRequestPending,
		(userId IN (SELECT secondUserId FROM userFollows WHERE firstUserId=%(current_user)s)) AS isFollowing
		FROM users
		WHERE concat(firstName, ' ', lastName) LIKE %(query)s
		LIMIT %(limit)s;
		""", {"query" : "%" + query + "%", "limit" : limit, "current_user" : current_user_id})

	user_rows = cursor.fetchall()

	returned_users = []
	for user_row in user_rows:
		(user_id, first_name, last_name, nick_name,portrait,
			is_request_sent, is_request_pending, is_following) = user_row

		user_friend_status = "none"
		if is_request_sent and is_request_pending:
			user_friend_status = "friends"
		elif is_request_sent:
			user_friend_status = "sent"
		elif is_request_pending:
			user_friend_status = "pending"

		returned_users.append(UserSearchEntry(user_id, first_name + ' ' + last_name, portrait, is_following, user_friend_status))

	return returned_users