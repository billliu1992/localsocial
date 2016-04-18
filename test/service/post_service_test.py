import unittest

from mock import patch
from localsocial.service import post_service

class PostServiceTest(unittest.TestCase):
	@patch('localsocial.database.post_dao')
	def test_create_new_post(post_d