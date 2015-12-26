from localsocial.model.location_model import Location

class Reply:
	def __init__(self, post_id, author_id, author_name, body, reply_date, location, edited):
		if not isinstance(location, Location):
			raise ValueError("argument 'location' must be a Location object")

		self.reply_id = -1
		self.post_id = post_id
		self.author_id = author_id
		self.author_name = author_name
		self.reply_body = body
		self.reply_date = reply_date
		self.location = location
		self.edited = edited

	@property
	def latitude(self):
		return self.location.latitude

	@property
	def longitude(self):
		return self.location.longitude

	@property
	def city(self):
		return self.location.city

	def to_json_dict(self):
		reply_dict = self.__dict__
		reply_dict["reply_date"] = reply_dict["reply_date"].isoformat("T")
		reply_dict["location"] = reply_dict["location"].to_json_dict()

		return reply_dict