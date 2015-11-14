import psycopg2

from localsocial import app

print(app.config["DB_PASSWORD"])
db_conn = psycopg2.connect(database=app.config["DB_NAME"], host=app.config["DB_HOST"],
	user=app.config["DB_USERNAME"], password=app.config["DB_PASSWORD"])