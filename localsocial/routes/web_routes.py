from flask import send_file, redirect
from localsocial import app

from localsocial.service.picture import filesystem_storage_service

@app.route('/')
def serve_index_page():
	return redirect('/web/home.html')

@app.route('/image/<hashed>')
def serve_uploaded_images(hashed):
	return filesystem_storage_service.get_image(hashed)

@app.route('/image/<hashed>/thumb')
def serve_uploaded_thumbnail(hashed):
	return filesystem_storage_service.get_image(hashed, True)

@app.route('/portrait/test')
def serve_test_portrait():
	return send_file('test-portrait.jpg')
