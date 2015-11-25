import requests

from localsocial.model.location_model import Location

def get_geoip_location(ip):
	geoip_request = requests.get("https://freegeoip.net/json/#localsocialwebapp")

	if geoip_request.status_code == 200:
		return geoip_request.json()
	else:
		raise Exception("Error getting geoip. Status code " + geoip_request.status_code)
		