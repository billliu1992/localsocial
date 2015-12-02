import json
import localsocial.service.post_service
from flask import request, g
from localsocial import app
from localsocial.service import post_service, location_service
from localsocial.model.location_model import Location
from localsocial.decorator.user_decorator import login_required
from localsocial.decorator.route_decorator import api_endpoint

@api_endpoint('/post', methods=("GET",))
@login_required
def get_posts():
	max_id = request.args.get('max_id', None)
	page_num = request.args.get('page_num', 0)
	post_per_page = request.args.get('post_per_page', 10)

	current_posts = post_service.get_posts(page_num, post_per_page, max_id)

	output_json = {
		"error" : False,
		"max_id" : max_id,
		"page_num" : page_num,
		"post_per_page" : post_per_page,
		"length" : len(current_posts)
	}

	posts_json = []
	for post in current_posts:
		posts_json.append(post.to_json_dict())

	output_json["posts"] = posts_json

	return output_json


@api_endpoint('/post', methods=("POST",))
@login_required
def create_posts():
	current_user = g.user

	body = request.form['post-body']
	privacy = request.form['privacy']

	current_location = None

	#manual location input
	city = request.form.get('city', None)
	longitude = request.form.get('longitude', None)
	latitude = request.form.get('latitude', None)


	if(len(body) < 10):
		return {
			"error" : True,
			"message" : "Please include a post body with length greater than 10"
		}
	else:
		if city != None:
			try:
				longitude_parsed = float(longitude)
				latitude_parsed = float(latitude)
			except:
				return { "error" : True, "message" : "Longitude and latitude needs to be decimals" }

			current_location = Location(city, longitude_parsed, latitude_parsed)
		else:
			try:
				current_location = location_service.get_geoip_location(request.remote_addr)
			except:
				return { "error" : True, "message" : "Server could not get a location" }, 500

		new_post = post_service.create_new_post(current_user, body, privacy, current_location)

		result_json_dict = {
			"error" : False,
			"result" : new_post.to_json_dict()
		}
		return result_json_dict