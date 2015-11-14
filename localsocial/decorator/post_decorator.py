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

			json_dict_result = original_function(*args, **kwargs)

			stringified_json = ""
			if request.args.get("pretty") == "true":
				stringified_json = json.dumps(json_dict_result, indent=4, separators=(',', ': '))
			else:
				stringified_json = json.dumps(json_dict_result)

			print("HELLLO!")
			print(stringified_json)

			new_response = make_response(stringified_json)
			new_response.mimetype = "application/json"
			
			return new_response
		return new_function
	return decorator