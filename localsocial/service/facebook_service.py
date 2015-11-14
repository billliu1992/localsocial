import json
import requests

def get_auth_redirect(app_id, redirect):
	return "https://www.facebook.com/dialog/oauth?client_id=" + app_id + "&redirect_uri=" + redirect

def get_access_token(app_id, app_secret, code, redirect):
	query_string_dict = {
		"client_id" : app_id,
		"client_secret" : app_secret,
		"redirect_uri" : redirect,
		"code" : code
	}
	access_token_req = requests.get("https://graph.facebook.com/v2.3/oauth/access_token", params = query_string_dict)

	output = access_token_req.json()

	if u'access_token' in output:
		return output[u'access_token']
	else:
		print(output)	# TODO: LOG ME
		
		raise Exception("Got exception when getting Facebook access token")

def get_user_info(access_token):
	query_string_dict = {
		"access_token" : access_token,
		"fields" : "first_name,last_name,id"
	}
	user_info_req = requests.get("https://graph.facebook.com/v2.5/me", params = query_string_dict)

	output = user_info_req.json()

	return output