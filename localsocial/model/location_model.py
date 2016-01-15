class Location(object):
	def __init__(self, city, longitude, latitude):
		if not isinstance(longitude, float) and longitude != None:
			raise ValueError('Second argument (longitude) must be a float or None')

		if not isinstance(latitude, float) and latitude != None:
			raise ValueError('Third argument (latitude) must be a float or None')

		self.city = city
		self.longitude = longitude
		self.latitude = latitude

	def to_json_dict(self):
		return self.__dict__