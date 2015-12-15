import json

from functools import wraps
from flask import make_response, request, g
from localsocial import app
from localsocial.service import location_service

#TODO: Right now, location_endpoint is dependent on api_endpoint since it returns a dict. We should change this
def location_endpoint(original_function):
	@wraps(original_function)
	def new_function(*args, **kwargs):
		detected_location = None
		if request.method == "POST":
			city = request.args.get('city', None)
			longitude = request.args.get('longitude', None)
			latitude = request.form.get('latitude', None)
		elif request.method == "GET":
			city = request.form.get('city', None)
			longitude = request.form.get('longitude', None)
			latitude = request.form.get('latitude', None)

		if city != None and longitude != None and latitude != None:
			try:
				longitude_parsed = float(longitude)
				latitude_parsed = float(latitude)

				detected_location = Location(city, longitude_parsed, latitude_parsed)
			except ValueError:
				pass	#TODO Log me
		
		if detected_location == None:
			detected_location = location_service.get_geoip_location(request.remote_addr)

		if detected_location != None:
			g.user_location = detected_location

			return original_function(*args, **kwargs)
		else:
			return { error : true, message : "Could not detect location" }, 400

	return new_function

def api_endpoint(rule, **options):
	def decorator(original_function):
		@app.route(rule, **options)
		@wraps(original_function)
		def new_function(*args, **kwargs):
			endpoint = options.pop('endpoint', None)

			original_response = original_function(*args, **kwargs)

			if(isinstance(original_response, tuple)):
				json_dict_result = original_response[0]
				status_code = original_response[1]
			else:
				json_dict_result = original_response
				status_code = 200


			stringified_json = ""
			if request.args.get("pretty") == "true":
				stringified_json = json.dumps(json_dict_result, indent=4, separators=(',', ': '))
			else:
				stringified_json = json.dumps(json_dict_result)

			new_response = make_response(stringified_json, status_code)
			new_response.mimetype = "application/json"
			
			return new_response
		return new_function
	return decorator