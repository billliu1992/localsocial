import requests

import geoip2.database
from geoip2.errors import AddressNotFoundError

from localsocial import app
from localsocial.model.location_model import Location
from localsocial.exceptions import ServiceException

reader = geoip2.database.Reader(app.config['MAXMIND_GEOIP_PATH'])

def get_geoip_location(ip):
	if ip == "127.0.0.1":
		ip = "128.174.0.0"	# University of Illinois at Champaign-Urbana

	try:
		response = reader.city(ip)

		city_name = response.city.name
		latitude = response.location.latitude
		longitude = response.location.longitude
	except AddressNotFoundError as anfe:
		city_name = "Urbana"
		latitude = 40.1095
		longitude = -88.2123

	return Location(city_name, longitude, latitude)