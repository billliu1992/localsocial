from psycopg2.extensions import AsIs

from localsocial.database.db import db_conn, handled_execute

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
		WHERE firstUserId = %s, secondUserId = %s;
		""", (AsIs(relation_type), user_id1, user_id2))

	return True

def get_friends(user_id, **kwargs):
	return get_relationships(user_id, FRIENDS_TABLE, **kwargs)

def get_follows(user_id, **kwargs):
	return get_relationships(user_id, FOLLOWS_TABLE, **kwargs)

def get_relationships(user_id, relation_type, **kwargs):
	reverse = kwargs.get('reverse', False)
	mutual = kwargs.get('mutual', False)
	not_mutual = kwargs.get('not_mutual', False)

	query_params = {"table" : AsIs(relation_type), "user_id" : user_id}

	if reverse:
		query_params["initiator"] = AsIs("secondUserId")
		query_params["target"] = AsIs("firstUserId")
	else:
		query_params["initiator"] = AsIs("firstUserId")
		query_params["target"] = AsIs("secondUserId")

	if mutual:
		cursor = handled_execute(db_conn, """
			SELECT %(target)s FROM %(table)s
			WHERE %(initiator)s = %(user_id)s AND %(target)s IN
				(SELECT %(initiator)s FROM %(table)s
					WHERE %(target)s = %(user_id)s)
			""", query_params)
	elif not_mutual:
		cursor = handled_execute(db_conn, """
			SELECT %(target)s FROM %(table)s
			WHERE %(initiator)s = %(user_id)s AND NOT %(target)s IN
				(SELECT %(initiator)s FROM %(table)s
					WHERE %(target)s = %(user_id)s)
			""", query_params)
	else:
		cursor = handled_execute(db_conn, """
			SELECT %(target)s FROM %(table)s WHERE %(initiator)s = %(user_id)s
			""", query_params)

	result_rows = cursor.fetchall()

	user_ids = []
	for row in result_rows:
		user_ids.append(row[0])

	return user_ids