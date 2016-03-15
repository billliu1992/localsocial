import requests

from localsocial.model.location_model import Location
from localsocial.exceptions import ServiceException 

def get_geoip_location(ip):
	return Location("Test", -88.2183973, 40.0990071)

#	geoip_request = requests.get("https://freegeoip.net/json/#localsocialwebapp")

#	if geoip_request.status_code == 200:
#		request_dict = geoip_request.json()

#		return Location(request_dict["city"], request_dict["longitude"], request_dict["latitude"])
#	else:
#		raise ServiceException("Error getting geoip. Status code " + str(geoip_request.status_code))
		