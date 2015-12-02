from localsocial.service import facebook_service, user_service 

from localsocial import app
from localsocial.decorator.user_decorator import login_required
from localsocial.decorator.route_decorator import api_endpoint
from flask import redirect, request, session

@app.route('/login/facebook')
def facebook_login():
	return redirect(facebook_service.get_auth_redirect(app.config["FB_APP_ID"], "http://localhost:5000/login/facebook/callback"))	#Config-itize

@app.route('/login/facebook/callback')
def facebook_login_callback():
	if "error" in request.args or "error_code" in request.args:
		redirect("/login/facebook/error")
	else:
		code = request.args["code"]

		access_token = facebook_service.get_access_token(app.config["FB_APP_ID"], app.config["FB_APP_SECRET"], code, "http://localhost:5000/login/facebook/callback")

		logged_in_user = user_service.login_user_facebook(access_token)

		session['user_id'] = logged_in_user.user_id

		return "Created new user"	#TODO Redirect to home page

@app.route("/login/facebook/error")
def facebook_login_error():
	return "Error"

@api_endpoint('/user/me')
@login_required
def get_current_user():
	current_user = g.user

	return current_user.to_json_dict()