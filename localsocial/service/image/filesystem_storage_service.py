import os

from localsocial import app
from flask import request, secure_filename
from PIL import Image

def save_image(param_name, folder_name, crop_left, crop_top, crop_height, crop_width):
	new_file = request.files[param_name]
	secured_name = secure_filename(new_file.filename)
	sec_root, sec_ext = os.path.splitext(secured_name)

	folder_path = os.path.join(app.config["FILESYSTEM_STORE_FOLDER"], folder_name)

	if not os.path.exists(folder_path):
		os.mkdir(folder_name)

	orig_file_path = os.path.join(folder_path, secured_name)
	thumb_file_path = os.path.join(folder_path, sec_root + ".jpg")

	if not os.path.exists(file_path):
		new_file.save(file_path)

		image_file = Image.open(file_path)

		image_file.


	return new_file.filename

def get_image(