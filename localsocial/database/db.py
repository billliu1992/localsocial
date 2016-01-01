import psycopg2

from psycopg2 import DatabaseError
from localsocial import app
from localsocial.exceptions import DAOException

db_conn = psycopg2.connect(database=app.config["DB_NAME"], host=app.config["DB_HOST"],
	user=app.config["DB_USERNAME"], password=app.config["DB_PASSWORD"])

def handled_execute(db_conn, query, params):
	cursor = db_conn.cursor()

	try:
		cursor.execute(query, params)
	except DatabaseError as dbe:
		db_conn.rollback()

		# TODO Implement better logging
		print("Got database error " + str(dbe))

		raise DAOException("Got error when running query (will rollback): " + query)
	else:
		db_conn.commit()

		return cursor
