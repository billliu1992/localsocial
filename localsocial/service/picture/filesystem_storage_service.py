import os
import hashlib
import time

from localsocial import app
from localsocial.model.picture_model import UploadedPicture
from flask import request, send_from_directory
from werkzeug import secure_filename
from PIL import Image

def save_image(param_name, user_id, crop_left, crop_top, crop_width, crop_height):
	new_file = request.files[param_name]
	secured_name = secure_filename(new_file.filename)
	user_id_str = str(user_id)

	folder_path = os.path.join(app.config["FILESYSTEM_STORE_FOLDER"], str(user_id_str))

	if not os.path.exists(folder_path):
		os.makedirs(folder_path)

	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(secured_name)
	hashed_name_obj.update(user_id_str)
	hashed_name_obj.update(str(time.time()))
	hashed_name = hashed_name_obj.hexdigest()

	orig_file_path = os.path.join(folder_path, secured_name)
	compressed_file_path = os.path.join(folder_path, hashed_name + ".jpg")
	thumb_file_path = os.path.join(folder_path, hashed_name + "_thumb.jpg")

	if not os.path.exists(orig_file_path):
		new_file.save(orig_file_path)

		image_file = Image.open(orig_file_path)

		image_file.save(compressed_file_path, quality=95)

		image_file = Image.open(orig_file_path)

		print((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height))
		print(app.config["THUMBNAIL_SIZE"])

		image_file.crop((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height)).save(thumb_file_path, quality=95)

		#.resize(app.config["THUMBNAIL_SIZE"])

		print("HIHIHI")

	return new_file.filename, hashed_name

def get_image(user_id, picture_hash, thumb=False):
	user_id_str = str(user_id)

	picture_filename = picture_hash
	if thumb:
		picture_filename += "_thumb"
	picture_filename += ".jpg"

	picture_path = os.path.join(app.config["FILESYSTEM_STORE_FOLDER"], user_id_str, picture_filename)

	if os.path.exists(folder_path):
		os.send_from_directory(picture_path)
	else:
		return "No image", 404
