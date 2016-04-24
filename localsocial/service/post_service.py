"""
Service for operations on posts, including replies and likes
"""

import json

from datetime import datetime
from localsocial.service.util import page_to_query
from localsocial.database import post_dao, reply_dao, like_dao
from localsocial.model.post_model import Post, EventPost, ImagePost
from localsocial.model.reply_model import Reply

def create_new_post(author, body, privacy, location):
	"""
	Create a new post and persist it

	Returns the persisted post
	"""
	current_time = datetime.now()

	new_post = Post(author.user_id, author.full_name, author.portrait, body, current_time, privacy, location, 0, False)

	post_dao.create_post(new_post)

	return new_post

def create_new_reply(author, body, parent_post_id, location, privacy):
	"""
	Create a new reply and persist it

	Returns the persisted reply
	"""
	current_time = datetime.now()

	new_reply = Reply(parent_post_id, author.user_id, "", author.portrait, body, 
		current_time, location, privacy, False)

	reply_dao.create_reply(new_reply)

	return new_reply

def delete_post_by_id(current_user_id, post_id):
	"""
	Delete the post with the post_id and current_user_id. The current_user_id
	is used for validation.

	Return True if successful
	"""
	reply_dao.delete_replies_by_post_id(post_id)
	like_dao.delete_likes(post_id)

	return post_dao.delete_post_by_id(post_id, current_user_id) > 0

def delete_reply_by_id(current_user_id, reply_id):
	"""
	Delete the reply with the post_id and current_user_id. The current_user_id
	is used for validation.

	Return True if successful
	"""
	return reply_dao.delete_reply_by_id(reply_id, current_user_id)

def get_posts_by_user(current_user_id, searched_user, are_friends, page_num=1, post_per_page=10, max_id=None):
	"""
	Get all the posts with by searched_user. Post visibility is determined by current_user_id and are_friends.
	Parameters can be passed in for pagination.

	Returns a list of the queried post
	"""
	limit = page_to_query(page_num, post_per_page)

	return post_dao.get_posts_by_user(current_user_id, searched_user, are_friends, limit, max_id)

def get_post_by_id(current_user_id, post_id):
	"""
	Get a single post by the post_id. Visiblity is determined by current_user_id.

	Returns the post object
	"""
	return post_dao.get_post_by_id(current_user_id, post_id)

def get_post_feed(current_user_id, location, max_dist=25, page_num=1, post_per_page=10, max_id = None):
	"""
	Get the user's feed. Parameters can be passed for distance filtering and pagination.

	Returns a list of posts
	"""
	limit = page_to_query(page_num, post_per_page)
		
	return post_dao.get_post_feed(current_user_id, location, max_dist, post_per_page, limit, max_id)

def get_post_replies(post):
	"""
	Get all the replies to the passed in post

	Returns a list of replies
	"""
	return reply_dao.get_replies_by_post_id(post.post_id)

def create_like(post_id, author_id):
	"""
	Creates a like to the post as the author_id, and persist it
	"""
	return like_dao.create_like(post_id, author_id)

def delete_like(post_id, author_id):
	"""
	Deletes a like to the post as the author_id, and persists it
	"""
	return like_dao.delete_like(post_id, author_id)