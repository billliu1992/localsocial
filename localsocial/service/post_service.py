import json

from datetime import datetime
from localsocial.database import post_dao
from localsocial.model.post_model import Post, EventPost, ImagePost

def create_new_post(author, body, privacy):
	current_time = datetime.now()

	# Do Location Service call here

	new_post = Post(author.user_id, author.full_name, body, current_time, "public", "", 0.0, 0.0)

	post_dao.create_post(new_post)

	return new_post

def get_posts(page_num=1, post_per_page=10, max_id = None):
	if(page_num < 1):
		page_num = 1
		
	return post_dao.get_posts(post_per_page, (page_num - 1) * post_per_page, max_id)

def get_post_json(post):
	post_dict = post.__dict__

	post_dict['post_date'] = str(post_dict['post_date'])

	return post_dict