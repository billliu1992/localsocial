class LocalSocialException(Exception):
	pass

class DAOException(LocalSocialException):
	pass

class ServiceException(LocalSocialException):
	pass

class UserServiceException(ServiceException):
	pass

class CreateUserException(ServiceException):
	pass