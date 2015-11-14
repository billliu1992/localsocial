from flask import Flask, send_from_directory

app = Flask(__name__, instance_relative_config=True)

app.config.from_pyfile('config.py')


from localsocial.routes import user_routes

@app.route('/')
def debug_index():
	print("I GOT HERE")
	return '<a href="/login/facebook">Login</a>'