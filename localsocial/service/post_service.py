import json

from datetime import datetime
from localsocial.database import post_dao, reply_dao
from localsocial.model.post_model import Post, EventPost, ImagePost
from localsocial.model.reply_model import Reply

def create_new_post(author, body, privacy, location):
	current_time = datetime.now()

	new_post = Post(author.user_id, author.full_name, body, current_time, privacy, location)

	post_dao.create_post(new_post)

	return new_post

def create_new_reply(author, body, parent_post_id, location):
	current_time = datetime.now()

	new_reply = Reply(parent_post_id, author.user_id, author.full_name, body, current_time, location, False)

	reply_dao.create_reply(new_reply)

	return new_reply

def get_posts_by_user(current_user_id, searched_user_id, page_num=1, post_per_page=10, max_id=None):
	if page_num < 1:
		page_num = 1

	return post_dao.get_posts_by_user(current_user_id, searched_user_id, post_per_page, (page_num - 1) * post_per_page, max_id)

def get_post_feed(user, location, max_dist=25, page_num=1, post_per_page=10, max_id = None):
	if(page_num < 1):
		page_num = 1
		
	return post_dao.get_post_feed(location, max_dist, post_per_page, (page_num - 1) * post_per_page, max_id)

def get_post_replies(post):
	return reply_dao.get_replies_by_post_id(post.post_id)