import os
import hashlib
import time

from localsocial import app
from localsocial.model.picture_model import UploadedPicture
from PIL import Image

# Do paths
upload_folder_path = os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"])
if not os.path.exists(upload_folder_path):
		os.makedirs(upload_folder_path)

def save_image(uploaded_file, new_filename):
	compressed_file_path = os.path.join(upload_folder_path, new_filename + ".jpg")
	
	image_file = Image.open(uploaded_file)

	image_file.save(compressed_file_path, quality=95)

	return uploaded_file.filename

def save_cropped_image(uploaded_file, new_filename, crop):
	cropped_file_path = os.path.join(upload_folder_path, new_filename + ".jpg")

	image_file = Image.open(uploaded_file)

	image_file.crop((crop.left, crop.top, crop.right, crop.bottom)).resize(app.config["THUMBNAIL_SIZE"]).save(cropped_file_path, quality=95)

	return uploaded_file.filename

def get_image(picture_hash):
	picture_path = os.path.join(upload_folder_path, picture_hash + ".jpg")

	return open(picture_path, "r")

def get_image_hash(picture_id, author_id):
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(picture_id))
	hashed_name_obj.update(str(author_id))
	hashed_name_obj.update(app.config["IMAGE_STORAGE_PASSWORD"])
	return hashed_name_obj.hexdigest()

def get_cropped_hash(cropped_id, author_id):
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(cropped_id))
	hashed_name_obj.update(str(author_id))
	hashed_name_obj.update("crop")
	hashed_name_obj.update(app.config["IMAGE_STORAGE_PASSWORD"])
	return hashed_name_obj.hexdigest()