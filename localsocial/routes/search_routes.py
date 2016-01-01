from localsocial import app
from localsocial.service import search_service
from localsocial.decorator.route_decorator import api_endpoint 

from flask import request

@api_endpoint('/search')
def do_search_query():
	query = request.args.get('query', '')

	if len(query) < 4:
		return { "result" : [], "tooshort" : True }
	else:
		users_list = search_service.query_users(query)
		json_dict_list = []

		for user in users_list:
			json_dict_list.append(user.to_json_dict())
			
		return { "result" : json_dict_list }