import unittest

from localsocial.exceptions import CreateUserException
from localsocial.service import user_service
from localsocial.model.user_model import User

class UserServiceTest(unittest.TestCase):
	def test_validate_user_email_none(self):
		test_user = User(None, None, "test", "test", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_email_empty(self):
		test_user = User("", None, "test", "test", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_email_bad_format(self):
		test_user = User("1@" , None, "test", "test", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_email_valid(self):
		test_user = User("test@test.com" , None, "test", "test", None, None, "", None)

	def test_validate_user_fname_none(self):
		test_user = User("test@test.com" , None, None, "test", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_fname_empty(self):
		test_user = User("test@test.com" , None, "", "test", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_fname_valid(self):
		test_user = User("test@test.com" , None, "t", "test", None, None, "", None)

	def test_validate_user_lname_none(self):
		test_user = User("test@test.com" , None, "test", None, None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_lname_empty(self):
		test_user = User("test@test.com" , None, "test", "", None, None, "", None)
		self.assertRaises(CreateUserException, user_service.validate_user, test_user)

	def test_validate_user_lname_valid(self):
		test_user = User("test@test.com" , None, "test", "t", None, None, "", None)

	def test_validate_password_mismatch(self):
		self.assertRaises(CreateUserException, user_service.validate_password, "testpass", "testpass1")

	def test_validate_password_short(self):
		short_pass = "a" * (user_service.MIN_PASSWORD_LENGTH - 1)
		self.assertRaises(CreateUserException, user_service.validate_password, short_pass, short_pass)