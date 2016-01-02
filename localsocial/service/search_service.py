from localsocial.database import search_dao, user_dao
from localsocial.service import user_service

def is_phone(query):
	return query.replace('-', '').replace(' ', '').isdigit()

def is_email(query):
	at_index = query.find('@')
	last_dot_index = query.rfind('.')

	return at_index > 0 and last_dot_index > at_index

def format_query_results(current_user, results, following, friends, request_sent, request_pending):
	formatted_results = []

	for result in results:
		is_friend = result.user_id in friends
		is_following = result.user_id in following
		is_request_sent = result.user_id in request_sent
		is_request_pending = result.user_id in request_pending


		if result.user_id != current_user.user_id:
			formatted_results.append({
				"user_id" : result.user_id,
				"portrait" : result.portrait,
				"name" : result.full_name,
				"friends" : is_friend,
				"following" : is_following,
				"request_sent" : is_request_sent,
				"is_request_pending" : is_request_pending
			});

	return formatted_results

def query_users(current_user, query, limit=20):
	following = user_service.get_following(current_user.user_id)
	friends = user_service.get_friends(current_user.user_id)
	pending = user_service.get_friend_requests_pending(current_user.user_id)
	sent = user_service.get_friend_requests_sent(current_user.user_id)

	if is_phone(query):
		try:
			return format_query_results(current_user, [user_dao.get_user_by_phone(query)], following, friends, sent, pending)
		except Exception as e:
			return []
	
	elif is_email(query):
		try:
			return format_query_results(current_user, [user_dao.get_user_by_email(query)], following, friends, sent, pending)
		except Exception as e:
			return []

	else:
		return format_query_results(current_user, search_dao.search_user_by_name(query, limit), following, friends, sent, pending)
