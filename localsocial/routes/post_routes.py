import json
import localsocial.service.post_service
from flask import request, g
from localsocial import app
from localsocial.service import post_service
from localsocial.decorator.user_decorator import login_required
from localsocial.decorator.post_decorator import api_endpoint

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
		posts_json.append(post_service.get_post_json(post))

	output_json["posts"] = posts_json

	return output_json


@api_endpoint('/post', methods=("POST",))
@login_required
def put_posts():
	current_user = g.user

	body = request.form['post-body']
	privacy = request.form['privacy']

	if(len(body) < 10):
		return {
			"error" : True,
			"message" : "Please include a post body with length greater than 10"
		}
	else:
		new_post = post_service.create_new_post(current_user, body, privacy)

		result_json_dict = {
			"error" : False,
			"result" : post_service.get_post_json(new_post)
		}
		return result_json_dict