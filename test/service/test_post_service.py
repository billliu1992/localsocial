import unittest

from mock import patch
from localsocial.model.location_model import Location
from localsocial.model.user_model import User
from localsocial.model.post_model import Post, POST_PRIVACY
from localsocial.service import post_service

class PostServiceTest(unittest.TestCase):
	@patch('localsocial.database.post_dao.create_post')
	def test_create_new_post(self, mocked_create_post):
		author = User("test@test.com", 123123, "test", "test", "test", 1, "test", None)
		post_body = "Test test test"
		post_privacy = POST_PRIVACY.PUBLIC
		test_loc = Location("Test", 1.0, 1.0)

		post_service.create_new_post(author, post_body, post_privacy, test_loc)

		new_post = mocked_create_post.call_args[0][0]

		self.assertEqual(new_post.author_id, author.user_id)
		self.assertEqual(new_post.body, post_body)
		self.assertEqual(new_post.privacy, post_privacy)
		self.assertEqual(new_post.location.city, test_loc.city)

	@patch('localsocial.database.reply_dao.create_reply')
	def test_create_new_reply(self, mocked_create_reply):
		author = User("test@test.com", 123123, "test", "test", "test", 1, "test", None)
		reply_body = "Test test test"
		reply_parent_id = 1
		reply_privacy = POST_PRIVACY.PUBLIC
		reply_loc = Location("Test", 1.0, 1.0)

		post_service.create_new_reply(author, reply_body, reply_parent_id, reply_loc, reply_privacy)

		new_reply = mocked_create_reply.call_args[0][0]

		self.assertEqual(new_reply.author_id, author.user_id)
		self.assertEqual(new_reply.reply_body, reply_body)
		self.assertEqual(new_reply.privacy, reply_privacy)
		self.assertEqual(new_reply.city, reply_loc.city)

	@patch('localsocial.database.post_dao.delete_post_by_id')
	def test_delete_post_by_id(self, mocked_delete_post):
		post_service.delete_post_by_id(1, 1)
		self.assertTrue(mocked_delete_post.called)

	@patch('localsocial.database.reply_dao.delete_reply_by_id')
	def test_delete_reply_by_id(self, mocked_delete_reply):
		post_service.delete_reply_by_id(1, 1)
		self.assertTrue(mocked_delete_reply.called)

	@patch('localsocial.database.post_dao.get_posts_by_user')
	def test_get_posts_by_user(self, mocked_get_posts_by_user):
		post_service.get_posts_by_user(1, 1, 1)
		self.assertTrue(mocked_get_posts_by_user.called)

	@patch('localsocial.database.post_dao.get_post_by_id')
	def test_get_post_by_id(self, get_post_by_id):
		post_service.get_post_by_id(1, 1)
		self.assertTrue(get_post_by_id.called)

	@patch('localsocial.database.post_dao.get_post_feed')
	def test_get_post_by_id(self, get_post_feed):
		test_loc = Location("Test", 1.0, 1.0)

		post_service.get_post_feed(1, test_loc)
		self.assertTrue(get_post_feed.called)

	@patch('localsocial.database.reply_dao.get_replies_by_post_id')
	def test_get_post_replies(self, get_replies_by_post_id):
		test_loc = Location("Test", 1.0, 1.0)
		test_post = Post(1, "Hi", 1, "Hi", None, POST_PRIVACY.PUBLIC, test_loc, 1, True)

		post_service.get_post_replies(test_post)
		self.assertTrue(get_replies_by_post_id.called)

	@patch('localsocial.database.like_dao.delete_like')
	def test_create_like(self, delete_like):
		post_service.delete_like(1, 1)
		self.assertTrue(delete_like.called)

	@patch('localsocial.database.like_dao.delete_like')
	def test_create_like(self, delete_like):
		post_service.delete_like(1, 1)
		self.assertTrue(delete_like.called)