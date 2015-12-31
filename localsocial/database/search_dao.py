from localsocial.database.db import db_conn
from localsocial.model.user_model import User

def search_user_by_name(query, limit):
	cursor = db_conn.cursor()

	cursor.execute("""
		SELECT userId, email, phone, firstName,lastName,nickName,portrait FROM users
		WHERE concat(firstName, ' ', lastName) LIKE %s
		LIMIT %s;
		""", ("%" + query + "%", limit))

	db_conn.commit()

	user_rows = cursor.fetchall()

	returned_users = []
	for user_row in user_rows:
		(user_id, email, phone, first_name, last_name,
			nick_name, portrait) = user_row

		returned_user = User(email, phone, first_name, last_name, nick_name, portrait)
		returned_user.user_id = user_id

		returned_users.append(returned_user)

	return returned_users