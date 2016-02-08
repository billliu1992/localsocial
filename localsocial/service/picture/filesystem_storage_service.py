import os
import hashlib
import time

from localsocial import app
from localsocial.model.picture_model import UploadedPicture
from PIL import Image

# Do paths
upload_folder_path = os.path.join(app.root_path, folder_path)
if not os.path.exists(folder_path):
		os.makedirs(folder_path)

def save_image(uploaded_file, new_filename):
	compressed_file_path = os.path.join(upload_folder_path, new_filename + ".jpg")
	
	image_file = Image.open(uploaded_file)

	image_file.save(compressed_file_path, quality=95)

	return new_file.filename

def save_cropped_image(uploaded_file, new_filename, crop_left, crop_top, crop_width, crop_height):
	cropped_file_path = os.path.join(upload_folder_path, new_filename + ".jpg")

	image_file = Image.open(uploaded_file)

	image_file.crop((crop_left, crop_top, crop_left + crop_width, crop_top + crop_height)).resize(app.config["THUMBNAIL_SIZE"]).save(cropped_file_path, quality=95)

	return new_file.filename

def get_image_hash(picture_id, author_id):
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(picture_id))
	hashed_name_obj.update(str(author_id))
	return hashed_name_obj.hexdigest()

def get_cropped_hash(cropped_id, picture_id, author_id):
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(cropped_id))
	hashed_name_obj.update(str(picture_id))
	hashed_name_obj.update(str(author_id))
	return hashed_name_obj.hexdigest()