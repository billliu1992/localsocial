from localsocial.service import user_service
from functools import wraps
from flask import g, session

def login_required(original_function):
	@wraps(original_function)
	def new_function(*args, **kwargs):
		if 'user_id' in session:
			g.user = user_service.get_user_by_id(session['user_id'])
			return original_function(*args, **kwargs)
		else:
			return "Log in", 401

	return new_function

def query_user(*args, **kwargs):
	self_check = kwargs.get('self_check', False)
	get_object = kwargs.get('get_object', False)

	def decorator(original_function):
		@wraps(original_function)
		def new_function(*args, **kwargs):
			# Assume queried user is the first argument
			queried_user_identifier = kwargs.get('queried_user_identifier', None)

			if queried_user_identifier == None:
				pass
			elif queried_user_identifier.lower() == 'me':
				g.queried_user_id = session.get('user_id', None)

				if get_object:
					g.queried_user = g.get('user', None)
			else:
				try:
					user_id = int(queried_user_identifier)

					g.queried_user_id = user_id

					if get_object:
						g.queried_user = user_service.get_user_by_id(user_id)

				except ValueError as e:
					return { "error" : True, "reason" : "notfound" }

			if self_check and g.queried_user_id == session.get('user_id', None):
					return { "error" : True, "reason" : "self" }

			return original_function(*args, **kwargs)

		return new_function
	return decorator

