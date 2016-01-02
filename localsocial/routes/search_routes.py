from localsocial import app
from localsocial.service import search_service
from localsocial.decorator.route_decorator import api_endpoint
from localsocial.decorator.user_decorator import login_required

from flask import request, g

@api_endpoint('/search')
@login_required
def do_search_query():
	current_user = g.user

	query = request.args.get('query', '')
	limit = request.args.get('limit', 5)

	if len(query) < 4:
		return { "results" : [], "tooshort" : True }
	else:
		users_list = search_service.query_users(current_user, query, limit)
			
		return { "results" : users_list }