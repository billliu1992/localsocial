from flask import send_file, redirect, request, send_from_directory
from localsocial import app

def get_image(picture_hash, thumb=False):
	picture_filename = picture_hash
	if thumb:
		picture_filename += "_thumb"
	picture_filename += ".jpg"

	picture_path = os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"], picture_filename)

	if os.path.exists(picture_path):
		return send_from_directory(os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"]), picture_filename)
	else:
		return "No image", 404

@app.route('/')
def serve_index_page():
	return redirect('/web/home.html')

@app.route('/image/<hashed>')
def serve_uploaded_images(hashed):
	return get_image(hashed)

@app.route('/image/<hashed>/thumb')
def serve_uploaded_thumbnail(hashed):
	return get_image(hashed, True)

@app.route('/portrait/test')
def serve_test_portrait():
	return send_file('test-portrait.jpg')
