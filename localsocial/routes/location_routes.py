from localsocial import app
from localsocial.service import location_service
from localsocial.decorator.route_decorator import api_endpoint
from flask import request

@api_endpoint('/location', methods=("GET",))
def get_geoip_location():
	ip_address = request.remote_addr

	current_location = location_service.get_geoip_location(ip_address)

	return current_location.to_json_dict()

