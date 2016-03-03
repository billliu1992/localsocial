from psycopg2.extensions import AsIs

from localsocial.database.db import db_conn, handled_execute
from localsocial.database.util import build_name
from localsocial.model.user_model import Friendship, UserSummary

FRIENDS_TABLE = "userFriends"
FOLLOWS_TABLE = "userFollows"

def create_friend(user_id1, user_id2):
	return create_relationship(user_id1, user_id2, FRIENDS_TABLE)

def create_follow(user_id1, user_id2):
	return create_relationship(user_id1, user_id2, FOLLOWS_TABLE)

def create_relationship(user_id1, user_id2, relation_type):
	handled_execute(db_conn, """
		INSERT INTO %s (firstUserId, secondUserId)
		VALUES (%s, %s)
		""", (AsIs(relation_type), user_id1, user_id2))

	return True

def delete_friend(user_id1, user_id2):
	return delete_relationship(user_id1, user_id2, FRIENDS_TABLE)

def delete_follow(user_id1, user_id2):
	return delete_relationship(user_id1, user_id2, FOLLOWS_TABLE)

def delete_relationship(user_id1, user_id2, relation_type):
	handled_execute(db_conn, """
		DELETE FROM %s
		WHERE firstUserId = %s AND secondUserId = %s;
		""", (AsIs(relation_type), user_id1, user_id2))

	return True

def get_friends(user_id, **kwargs):
	return get_relationships(user_id, FRIENDS_TABLE, **kwargs)

def get_follows(user_id, **kwargs):
	return get_relationships(user_id, FOLLOWS_TABLE, **kwargs)

def get_friendship_status(user_id1, user_id2):
	cursor = handled_execute(db_conn, """
		SELECT firstUserId FROM userFriends WHERE
			(firstUserId = %(first_user_id)s AND secondUserId = %(second_user_id)s)
			OR (firstUserId = %(second_user_id)s AND secondUserId = %(first_user_id)s);
		""", { "first_user_id" : user_id1, "second_user_id" : user_id2 })

	result_rows = cursor.fetchall()

	if len(result_rows) == 2:
		return Friendship.FRIENDS
	elif len(result_rows) == 0:
		return Friendship.NOTHING
	else:
		initiator = result_rows[0][0]

		if initiator == user_id1:
			return Friendship.SENT
		else:
			return Friendship.PENDING

def get_relationships(user_id, relation_type, **kwargs):
	reverse = kwargs.get('reverse', False)
	mutual = kwargs.get('mutual', False)
	not_mutual = kwargs.get('not_mutual', False)
	ids_only = kwargs.get("ids_only", False)

	query_params = {"table" : AsIs(relation_type), "user_id" : user_id}

	if reverse:
		query_params["initiator"] = AsIs("secondUserId")
		query_params["target"] = AsIs("firstUserId")
	else:
		query_params["initiator"] = AsIs("firstUserId")
		query_params["target"] = AsIs("secondUserId")

	if mutual:
		if ids_only:
			cursor = handled_execute(db_conn, """
				SELECT %(target)s FROM %(table)s
				WHERE %(initiator)s = %(user_id)s AND %(target)s IN
					(SELECT %(initiator)s FROM %(table)s
						WHERE %(target)s = %(user_id)s)
				""", query_params)
		else:
			cursor = handled_execute(db_conn, """
				SELECT userId, firstName, lastName, nickName, portrait, portraitSetDate, showLastName 
					FROM %(table)s LEFT JOIN users ON %(table)s.%(target)s = users.userId
				WHERE %(initiator)s = %(user_id)s AND %(target)s IN
					(SELECT %(initiator)s FROM %(table)s
						WHERE %(target)s = %(user_id)s)
				""", query_params)
	elif not_mutual:
		if ids_only:
			cursor = handled_execute(db_conn, """
				SELECT %(target)s FROM %(table)s
				WHERE %(initiator)s = %(user_id)s AND NOT %(target)s IN
					(SELECT %(initiator)s FROM %(table)s
						WHERE %(target)s = %(user_id)s)
				""", query_params)
		else:
			cursor = handled_execute(db_conn, """
				SELECT userId, firstName, lastName, nickName, portrait, portraitSetDate, showLastName 
					FROM %(table)s LEFT JOIN users ON %(table)s.%(target)s = users.userId
				WHERE %(initiator)s = %(user_id)s AND NOT %(target)s IN
					(SELECT %(initiator)s FROM %(table)s
						WHERE %(target)s = %(user_id)s)
				""", query_params)
	else:
		if ids_only:
			cursor = handled_execute(db_conn, """
				SELECT %(target)s FROM %(table)s WHERE %(initiator)s = %(user_id)s
				""", query_params)
		else:
			cursor = handled_execute(db_conn, """
				SELECT userId, firstName, lastName, nickName, portrait, portraitSetDate, showLastName 
					FROM %(table)s LEFT JOIN users ON %(table)s.%(target)s = users.userId
				WHERE %(initiator)s = %(user_id)s
				""", query_params)

	result_rows = cursor.fetchall()

	if ids_only:
		user_ids = []
		for row in result_rows:
			user_ids.append(row[0])

		return user_ids
	else:
		user_summary_objs = []
		for row in result_rows:
			(user_id, first_name, last_name, nick_name, 
				portrait, portrait_set_date, show_last_name) = row

			user_name = build_name(first_name, nick_name, last_name, False, show_last_name)

			user_summary_objs.append(UserSummary(user_id, user_name, portrait, portrait_set_date))

		return user_summary_objs