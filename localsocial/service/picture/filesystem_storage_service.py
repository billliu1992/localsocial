import os
import hashlib
import time

from localsocial import app
from localsocial.model.picture_model import UploadedPicture
from flask import request, secure_filename, send_from_directory
from PIL import Image

def save_image(param_name, user_id, crop_left, crop_top, crop_height, crop_width):
	new_file = request.files[param_name]
	secured_name = secure_filename(new_file.filename)

	folder_path = os.path.join(app.config["FILESYSTEM_STORE_FOLDER"], user_id)

	if not os.path.exists(folder_path):
		os.mkdir(user_id)

	hashed_name = hashlib.md5()
		.update(secured_name)
		.update(user_id)
		.update(str(time.time()))
		.hexdigest()

	orig_file_path = os.path.join(folder_path, secured_name)
	compressed_file_path = os.path.join(folder_path, hashed_name + ".jpg")
	thumb_file_path = os.path.join(folder_path, hashed_name + "_thumb.jpg")

	if not os.path.exists(orig_file_path):
		new_file.save(orig_file_path)

		image_file = Image.open(orig_file_path)

		image_file.save(compressed_file_path, quality="95", optimize=True)

		image_file
			.crop((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height))
			.save(thumb_file_path, quality="95", optimize=True)


	return new_file.filename, hashed_name

def get_image(picture_obj, thumb):
	picture_filename = picture_obj.hashed_name
	if thumb:
		picture_filename += "_thumb"
	picture_filename += ".jpg"

	picture_path = os.path.join(app.config["FILESYSTEM_STORE_FOLDER"], picture_obj.author_id, picture_filename)

	if os.path.exists(folder_path):
		os.send_from_directory(picture_path)
	else:
		return "No image", 404
