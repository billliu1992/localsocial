from localsocial.database import search_dao, user_dao

def is_phone(query):
	return query.replace('-', '').replace(' ', '').isdigit()

def is_email(query):
	at_index = query.find('@')
	last_dot_index = query.rfind('.')

	return at_index > 0 and last_dot_index > at_index

def query_users(query, limit=20):
	if is_phone(query):
		try:
			return [user_dao.get_user_by_phone(query)]
		except Exception as e:
			return []
	
	elif is_email(query):
		try:
			return [user_dao.get_user_by_email(query)]
		except Exception as e:
			return []

	else:
		return search_dao.search_user_by_name(query, limit)
