import os
import hashlib
import time
import random

from localsocial import app
from localsocial.exceptions import ServiceException
from localsocial.model.picture_model import UploadedPicture
from PIL import Image

IMAGE_FOLDER = "images"
CROPPED_FOLDER = "cropped"

# Do paths
upload_folder_path = os.path.join(app.root_path, app.config["FILESYSTEM_STORE_FOLDER"])
if not os.path.exists(upload_folder_path):
	os.makedirs(upload_folder_path)

image_folder_path = os.path.join(upload_folder_path, IMAGE_FOLDER)
if not os.path.exists(image_folder_path):
	os.makedirs(image_folder_path)

cropped_folder_path = os.path.join(upload_folder_path, CROPPED_FOLDER)
if not os.path.exists(cropped_folder_path):
	os.makedirs(cropped_folder_path)

def save_image(uploaded_file, new_filename):
	compressed_file_path = os.path.join(image_folder_path, new_filename + ".jpg")

	image_file = Image.open(uploaded_file)

	width, height = image_file.size

	if width < app.config["THUMBNAIL_SIZE"] or height < app.config["THUMBNAIL_SIZE"]:
		raise ServiceException("Image too small")

	image_file.save(compressed_file_path, quality=95)

def save_cropped_image(uploaded_file, new_filename, crop):
	cropped_file_path = os.path.join(cropped_folder_path, new_filename + ".jpg")

	image_file = Image.open(uploaded_file)

	width, height = image_file.size

	scale = max(crop.width, crop.height) / float(app.config["THUMBNAIL_SIZE"])
	new_width = int(crop.width / scale)
	new_height = int(crop.height / scale)

	if crop.width < app.config["THUMBNAIL_SIZE"] or crop.height < app.config["THUMBNAIL_SIZE"]:
		raise ServiceException("Cropped area too small")

	image_file.crop((crop.left, crop.top, crop.right, crop.bottom)).resize((new_width, new_height)).save(cropped_file_path, quality=95)

def get_image(picture_hash):
	picture_path = os.path.join(image_folder_path, picture_hash + ".jpg")

	return open(picture_path, "r")

def delete_cropped(cropped_hash):
	cropped_path = os.path.join(cropped_folder_path, cropped_hash + ".jpg")

	return os.remove(cropped_path)

def get_image_hash(picture_id, author_id):
	if picture_id == None or author_id == None:
		return None

	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(picture_id))
	hashed_name_obj.update(str(author_id))
	hashed_name_obj.update(app.config["IMAGE_STORAGE_PASSWORD"])
	return hashed_name_obj.hexdigest()

def get_cropped_hash(cropped_id, author_id):
	if cropped_id == None or author_id == None:
		return None
		
	hashed_name_obj = hashlib.md5()
	hashed_name_obj.update(str(cropped_id))
	hashed_name_obj.update(str(author_id))
	hashed_name_obj.update(app.config["IMAGE_STORAGE_PASSWORD"])
	return hashed_name_obj.hexdigest()

def build_src(hash, type):
	return "/image/" + type + "/" + hash + ".jpg"

def get_image_src(picture_id, author_id):
	if picture_id == None or author_id == None:
		return "/portrait/none"

	return build_src(get_image_hash(picture_id, author_id), IMAGE_FOLDER)

def get_cropped_src(cropped_id, author_id):
	if cropped_id == None or author_id == None:
		return "/portrait/none"

	return build_src(get_cropped_hash(cropped_id, author_id), CROPPED_FOLDER)