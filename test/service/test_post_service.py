import unittest

from mock import patch
from localsocial.model.location_model import Location
from localsocial.model.user_model import User
from localsocial.model.post_model import POST_PRIVACY
from localsocial.service import post_service

class PostServiceTest(unittest.TestCase):
	@patch('localsocial.database.post_dao.create_post')
	def test_create_new_post(self, post_dao):
		test_loc = Location("Test", 1.0, 1.0)
		author = User("test@test.com", 123123, "test", "test", "test", 1, "test", None)

		post_service.create_new_post(author, "Test test test", POST_PRIVACY.PUBLIC, test_loc)

		print post_dao.call_args[0][0].post_id