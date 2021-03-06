from localsocial.database.db import db_conn, handled_execute

def create_like(post_id, author_id):
	cursor = handled_execute(db_conn, """
		INSERT INTO likes (postId, likerId) VALUES (%s, %s);
		""", (post_id, author_id))

	return cursor.rowcount

def delete_like(post_id, author_id):
	cursor = handled_execute(db_conn, """
		DELETE FROM likes WHERE postId=%s AND likerId=%s
		""", (post_id, author_id))

	return cursor.rowcount

def delete_likes(post_id):
	cursor = handled_execute(db_conn, """
		DELETE FROM likes WHERE postId=%s
		""", (post_id,))

	return cursor.rowcount