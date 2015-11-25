class Location(object):
	def __init__(self, city, longitude, latitude):
		if not isinstance(longitude, float):
			raise ValueError('Second argument (longitude) must be a float')

		if not isinstance(latitude, float):
			raise ValueError('Third argument (latitude) must be a float')

		self.city = city
		self.longitude = longitude
		self.latitude = latitude