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