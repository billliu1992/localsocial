import json

from functools import wraps
from flask import make_response, request
from localsocial import app


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