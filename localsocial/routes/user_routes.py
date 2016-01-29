from datetime import datetime

from localsocial import app
from localsocial.exceptions import ServiceException
from localsocial.decorator.user_decorator import login_required, query_user
from localsocial.decorator.route_decorator import api_endpoint, location_endpoint
from localsocial.service import facebook_service, user_service, post_service
from localsocial.service.picture import picture_meta_service, filesystem_storage_service
from localsocial.model.user_model import User, Friendship, UserPreferences
from localsocial.model.picture_model import UploadedPicture, PictureSection

from flask import redirect, request, session, g
from werkzeug import secure_filename

DEFAULT_PREFS = UserPreferences(True, True, False)

@app.route('/user/login/facebook')
def facebook_login():
	return redirect(facebook_service.get_auth_redirect(app.config["FB_APP_ID"], "http://localhost:5000/login/facebook/callback"))	#Config-itize

@app.route('/user/login/facebook/callback')
def facebook_login_callback():
	if "error" in request.args or "error_code" in request.args:
		redirect("/login/facebook/error")
	else:
		code = request.args["code"]

		access_token = facebook_service.get_access_token(app.config["FB_APP_ID"], app.config["FB_APP_SECRET"], code, "http://localhost:5000/login/facebook/callback")

		logged_in_user = user_service.login_user_facebook(access_token)

		session["user_id"] = logged_in_user.user_id

		return "Created new user"	#TODO Redirect to home page

@app.route("/user/login/facebook/error")
def facebook_login_error():
	return "Error"

@api_endpoint("/user/login", methods=("POST",))
def do_login():
	email = request.form["email"]
	password = request.form["password"]

	try:
		user_id = user_service.login(email, password)

		if user_id != None:
			session["user_id"] = user_id

			return { "success" : True }
		else:
			return { "success" : False }
	except:
		return { "success" : False }

@api_endpoint("/user/create", methods=("POST",))
def create_user():
	email = request.form["email"]
	phone = request.form.get("phone", None)
	first_name = request.form["first-name"]
	last_name = request.form["last-name"]
	nick_name = request.form.get("nick-name", None)
	portrait = None

	password = request.form["password"]
	confirm_password = request.form["confirm-password"]

	if password != confirm_password:
		return { "success" : False, "reason" : "password" }
	else:
		phone = user_service.convert_text_to_num(phone)
		new_user = User(email, phone, first_name, last_name, nick_name, portrait, None, "", DEFAULT_PREFS)

		new_user = user_service.create_new_user(new_user, password)
		session["user_id"] = new_user.user_id

		return { "success" : True }


@api_endpoint('/user/me', methods=("GET",))
@login_required
def get_my_info():
	requested_user = g.user

	user_dict = requested_user.to_json_dict(private=True)

	return user_dict

@api_endpoint('/user/me', methods=("POST",))
@login_required
def update_user_info():
	requested_user = g.user

	if "email" in request.form:
		requested_user.email = request.form["email"]
	elif "phone" in request.form:
		phone = request.form["phone"]
		phone = user_service.convert_text_to_num(phone)
		requested_user.phone = phone
	elif "first_name" in request.form:
		requested_user.first_name = request.form["first_name"]
	elif "last_name" in request.form:
		requested_user.last_name = request.form["last_name"]
	elif "nick_name" in request.form:
		requested_user.nick_name = request.form["nick_name"]
	elif "show_last_name" in request.form:
		requested_user.preferences.show_last_name = request.form["show_last_name"] == "true"
	elif "name_search" in request.form:
		requested_user.preferences.name_search = request.form["name_search"] == "true"
	elif "browser_geo" in request.form:
		requested_user.preferences.browser_geo = request.form["browser_geo"] == "true"

	updated_user = user_service.update_user(requested_user)

	return { "success" :  True, "user" : updated_user.to_json_dict(private=True) }

@api_endpoint('/user/me/password', methods=("POST",))
@login_required
def update_password():
	requested_user = g.user

	current = request.form.get("current", "")
	password = request.form.get("password", "")
	confirm = request.form.get("confirm", "")

	if password == confirm:
		change_result = user_service.update_user_credentials(requested_user, current, password)

		return { "success" : change_result, "reason" : "authentication" }
	else:
		return { "success" : False, "reason" : "confirm" }

@api_endpoint('/user/<queried_user_identifier>/profile')
@login_required
@location_endpoint
@query_user(get_object = True)
def get_user_profile(queried_user_identifier):
	requested_user = g.queried_user
	requested_user_id = g.queried_user_id
	current_user = g.user
	current_location = g.user_location

	friendship_status = user_service.get_friendship_status(current_user.user_id, requested_user_id)
	are_friends = friendship_status == Friendship.FRIENDS

	posts = post_service.get_posts_by_user(requested_user, are_friends)
	friends = user_service.get_friends(requested_user_id)
	followers = user_service.get_followers(requested_user_id)

	friend_objs = user_service.get_users_by_ids(friends)
	friend_json_dicts = []
	for friend in friend_objs:
		friend_json_dicts.append(friend.to_json_dict())

	post_json_dicts = []
	for post in posts:
		post_json_dict = post.to_json_dict()
		post_json_dicts.append(post_json_dict)

	# Build the result
	result_json_dict = requested_user.to_json_dict()
	result_json_dict['friends'] = friend_json_dicts
	result_json_dict['posts'] = post_json_dicts
	result_json_dict['follower_count'] = len(followers)
	result_json_dict['current_user_info'] = {
		"location" : current_location.to_json_dict(),
		"following" : current_user.user_id in followers,
		"friendship_status" : friendship_status
	}
	if current_user.user_id == requested_user_id:
		result_json_dict["self"] = current_user.user_id == requested_user_id

	return result_json_dict

@api_endpoint("/user/me/biography", methods=("POST",))
@login_required
def set_user_biography():
	current_user = g.user

	new_biography = request.form.get("biography", "")

	update_status = user_service.set_user_biography(current_user, new_biography)

	if not update_status:
		return { "error" : True }
	else:
		return { "error" : False }

	
@api_endpoint('/user/<queried_user_identifier>/friends', methods=("GET",))
@login_required
@query_user()
def get_friends(queried_user_identifier):
	queried_user_id = g.queried_user_id

	return user_service.get_friends(queried_user_id)

@api_endpoint('/user/me/friends/request', methods=("GET",))
@login_required
def get_friend_requests():
	current_user = g.user

	return user_service.get_friend_requests_pending(current_user.user_id)

@api_endpoint('/user/<queried_user_identifier>/follows', methods=("GET",))
@login_required
@query_user()
def get_followers(queried_user_identifier):
	queried_user_id = g.queried_user_id

	return user_service.get_followers(queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/follows/followers', methods=("GET",))
@login_required
@query_user()
def get_following(queried_user_identifier):
	queried_user_id = g.queried_user_id

	return user_service.get_following(queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/friends/request', methods=("POST",))
@login_required
@query_user(self_check = True)
def create_friend(queried_user_identifier):
	current_user = g.user
	queried_user_id = g.queried_user_id
	
	return user_service.create_friend(current_user.user_id, queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/follows/request', methods=("POST",))
@login_required
@query_user(self_check = True)
def create_follow(queried_user_identifier):
	current_user = g.user
	queried_user_id = g.queried_user_id

	return user_service.create_follow(current_user.user_id, queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/friends/request', methods=("DELETE",))
@login_required
@query_user(self_check = True)
def delete_friend(queried_user_identifier):
	current_user = g.user
	queried_user_id = g.queried_user_id
	
	return user_service.delete_friend(current_user.user_id, queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/follows/request', methods=("DELETE",))
@login_required
@query_user(self_check = True)
def delete_follow(queried_user_identifier):
	current_user = g.user
	queried_user_id = g.queried_user_id

	return user_service.delete_follow(current_user.user_id, queried_user_id)

@api_endpoint('/user/<queried_user_identifier>/image', methods=("GET",))
@login_required
@query_user()
def get_user_images(queried_user_identifier):
	current_user = g.user
	queried_user_id = g.queried_user_id

	picture_objs = picture_meta_service.get_pictures_by_user(queried_user_id, current_user.user_id)

	picture_json_dicts = []

	for picture in picture_objs:
		picture_json_dict = picture.to_json_dict()
		picture_json_dict["image_src"] = filesystem_storage_service.get_image_src(picture.picture_id, picture.author_id)
		picture_json_dicts.append(picture_json_dict)

	return picture_json_dicts

@api_endpoint('/user/me/image/profile', methods=("POST",))
@login_required
@location_endpoint
def upload_profile_photo():
	current_user = g.user
	current_location = g.user_location

	picture_id_str = request.form.get("profile-picture-id", None)
	crop_x_str = request.form["crop-x"]
	crop_y_str = request.form["crop-y"]
	crop_width_str = request.form["width"]
	crop_height_str = request.form["height"]
	privacy = request.form["privacy"]
	uploaded_photo = request.files.get("image", None)

	if picture_id_str == None and uploaded_photo == None:
		return { "success" : False }
	try:
		if picture_id_str != None:
			picture_id = int(picture_id_str)
		else:
			picture_id = None

		crop_x = int(crop_x_str)
		crop_y = int(crop_y_str)
		crop_width = int(crop_width_str)
		crop_height = int(crop_height_str)
	except ValueError as e:
		return { "success" : False }

	if picture_id == None:
		secured_name = secure_filename(uploaded_photo.filename)

		full_picture = UploadedPicture(current_user.user_id, datetime.now(), secured_name, current_location, None, None, privacy)
		picture_meta_service.create_picture(full_picture)

		# Temporary local filesystem storage
		hashed_filename = filesystem_storage_service.get_image_hash(full_picture.picture_id, full_picture.author_id)
		try:
			filesystem_storage_service.save_image(uploaded_photo, hashed_filename)
		except ServiceException as se:
			picture_meta_service.delete_picture_by_id(full_picture.picture_id)
			return { "success" : False, "message" : "Error saving new image" }
	else:
		full_picture = picture_meta_service.get_picture_by_id(picture_id, current_user.user_id)
		hashed_filename = filesystem_storage_service.get_image_hash(full_picture.picture_id, full_picture.author_id)
		uploaded_photo = filesystem_storage_service.get_image(hashed_filename)

	cropped_time = datetime.now()

	# Temporary local filesystem storae
	hashed_cropped_filename = filesystem_storage_service.get_cropped_hash(full_picture.picture_id, cropped_time, current_user.user_id)
	
	try:
		crop = PictureSection(crop_x, crop_y, crop_width, crop_height)
		filesystem_storage_service.save_cropped_image(uploaded_photo, hashed_cropped_filename, crop)
	except ServiceException as se:
		return { "success" : False, "message" : "Error saving cropped image" }

	current_user.portrait = full_picture.picture_id
	current_user.portrait_set_date = cropped_time
	updated_user = user_service.update_user(current_user)

	updated_user_json_dict = updated_user.to_json_dict(private=True)

	return { "success" : True, "user" : updated_user_json_dict }

@api_endpoint('/user/me/image/profile', methods=("DELETE",))
@login_required
def delete_profile_photo():
	current_user = g.user

	current_user.portrait = None
	updated_user = user_service.update_user(current_user)

	updated_user_json_dict = updated_user.to_json_dict(private=True)

	return { "success" : True, "user" : updated_user_json_dict }