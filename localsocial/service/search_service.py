from localsocial.database import search_dao, user_dao
from localsocial.service import user_service
from localsocial.exceptions import DAOException

def is_phone(query):
	return query.replace('-', '').replace(' ', '').isdigit()

def is_email(query):
	at_index = query.find('@')
	last_dot_index = query.rfind('.')

	return at_index > 0 and last_dot_index > at_index

def query_users(current_user, query, limit=20):
	if is_phone(query):
		try:
			return search_dao.search_user_by_phone(current_user.user_id, query, limit)
		except DAOException as e:
			return []
	
	elif is_email(query):
		try:
			return search_dao.search_user_by_email(current_user.user_id, query, limit)
		except DAOException as e:
			return []

	else:
		return search_dao.search_user_by_name(current_user.user_id, query, limit)
