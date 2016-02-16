import json
import localsocial.service.post_service
from flask import request, g
from localsocial import app
from localsocial.service import post_service, location_service
from localsocial.service.picture import filesystem_storage_service
from localsocial.model.location_model import Location
from localsocial.decorator.user_decorator import login_required
from localsocial.decorator.route_decorator import api_endpoint, location_endpoint

MINIMUM_POST_BODY_LENGTH = 10

def replies_to_json(replies):
	replies_json = []
	for reply in replies:
		replies_json.append(reply.to_json_dict())

	return replies_json

@api_endpoint('/post', methods=("GET",))
@location_endpoint
@login_required
def get_posts():
	current_user = g.user
	current_location = g.user_location

	max_dist = request.args.get('max_dist', 25)
	max_id = request.args.get('max_id', None)
	page_num = request.args.get('page_num', 0)
	post_per_page = request.args.get('post_per_page', 10)

	current_posts = post_service.get_post_feed(current_user.user_id, current_location, max_dist, page_num, post_per_page, max_id)

	output_json = {
		"error" : False,
		"max_id" : max_id,
		"current_location" : current_location.to_json_dict(),
		"pagination": {
			"page_num" : page_num,
			"post_per_page" : post_per_page,
			"length" : len(current_posts)
		}
	}

	posts_json = []
	for post in current_posts:
		post_json = post.to_json_dict()
		post_json["replies"] = replies_to_json(post_service.get_post_replies(post))

		posts_json.append(post_json)

	output_json["posts"] = posts_json

	return output_json

@api_endpoint('/post', methods=("POST",))
@location_endpoint
@login_required
def create_posts():
	current_user = g.user
	current_location = g.user_location

	body = request.form['post-body']
	privacy = request.form['privacy']

	if(len(body) < MINIMUM_POST_BODY_LENGTH):
		return {
			"error" : True,
			"message" : "Please include a post body with length greater than 10"
		}
	else:
		new_post = post_service.create_new_post(current_user, body, privacy, current_location)

		result_json_dict = {
			"error" : False,
			"result" : new_post.to_json_dict()
		}
		return result_json_dict


@api_endpoint('/post/<int:post_id>/reply', methods=("POST",))
@location_endpoint
@login_required
def create_reply(post_id):
	current_user = g.user
	current_location = g.user_location

	body = request.form['reply-body']

	new_reply = post_service.create_new_reply(current_user, body, post_id, current_location)

	return { "error" : False, "reply" : new_reply.to_json_dict() }