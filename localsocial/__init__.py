from flask import Flask, send_from_directory

app = Flask(__name__, instance_relative_config=True, static_url_path="/web", static_folder="../public/target")

app.config.from_pyfile('config.py')

app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


from localsocial.routes import user_routes
from localsocial.routes import post_routes
from localsocial.routes import web_routes
from localsocial.routes import location_routes
from localsocial.routes import search_routes