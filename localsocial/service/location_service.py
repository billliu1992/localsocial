import requests

from localsocial.model.location_model import Location

def get_geoip_location(ip):
	geoip_request = requests.get("https://freegeoip.net/json/#localsocialwebapp")

	if geoip_request.status_code == 200:
		request_dict = geoip_request.json()

		return Location(request_dict["city"], request_dict["longitude"], request_dict["latitude"])
	else:
		raise Exception("Error getting geoip. Status code " + geoip_request.status_code)
		