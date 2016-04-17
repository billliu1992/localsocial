import os

from flask import send_file, redirect, request, send_from_directory, session
from localsocial import app

def get_image(type, picture_hash):
	picture_filename = picture_hash

	picture_path = os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"], type, picture_filename)

	if os.path.exists(picture_path):
		return send_from_directory(os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"], type), picture_filename)
	else:
		return "No image", 404

@app.route('/')
def get_home():
	if 'user_id' in session:
		return redirect('/web/home.html')
	else:
		return redirect('/web/index.html')

@app.route('/web/')
def serve_index_page():
	return send_from_directory(os.path.join(app.root_path, "..", "public", "target"), "index.html")

@app.route('/web/home')
def serve_home_page():
	return send_from_directory(os.path.join(app.root_path, "..", "public", "target"), "home.html")

@app.route('/image/<type>/<hashed>')
def serve_uploaded_images(type, hashed):
	return get_image(type, hashed)

@app.route('/portrait/none')
def serve_no_portrait():
	return send_file('no-portrait.svg')

@app.route('/portrait/test')
def serve_test_portrait():
	return send_file('test-portrait.jpg')
