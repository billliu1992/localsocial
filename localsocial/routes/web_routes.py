from flask import send_file, redirect
from localsocial import app

from localsocial.service.picture import filesystem_storage_service

@app.route('/')
def serve_index_page():
	return redirect('/web/home.html')

@app.route('/image/<int:user_id>/<hash>')
def serve_uploaded_images(user_id, hashed):
	return filesystem_storage_service.get_image(user_id, hashed)

@app.route('/image/<int:user_id>/<hash>/thumb')
def serve_uploaded_thumbnail(user_id, hashed):
	return filesystem_storage_service.get_image(user_id, hashed, True)

@app.route('/portrait/test')
def serve_test_portrait():
	return send_file('test-portrait.jpg')
