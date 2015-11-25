from localsocial import app
from localsocial.service import location_service
from localsocial.decorator.route_decorator import api_endpoint
from flask import request

@api_endpoint('/location', methods=("GET",))
def get_geoip_location():
	ip_address = request.remote_addr

	result_dict = location_service.get_geoip_location(ip_address)

	if result_dict.get("error", False) == False:
		return result_dict, 200
	else:
		return result_dict, 500

