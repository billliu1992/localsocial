import os
import hashlib
import time

from localsocial import app
from localsocial.model.picture_model import UploadedPicture
from flask import request, send_from_directory
from PIL import Image

def save_image(wz_file, new_filename, crop_left, crop_top, crop_width, crop_height):
	new_file = wz_file

	folder_path = app.config["FILESYSTEM_STORE_FOLDER"]

	if not os.path.exists(folder_path):
		os.makedirs(folder_path)

	compressed_file_path = os.path.join(app.root_path, folder_path, new_filename + ".jpg")
	thumb_file_path = os.path.join(app.root_path, folder_path, new_filename + "_thumb.jpg")

	image_file = Image.open(wz_file)

	image_file.save(compressed_file_path, quality=95)

	image_file.crop((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height)).resize(app.config["THUMBNAIL_SIZE"]).save(thumb_file_path, quality=95)

	return new_file.filename

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

def get_image_hash(picture_id, author_id):
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(picture_id))
	hashed_name_obj.update(str(author_id))
	return hashed_name_obj.hexdigest()

