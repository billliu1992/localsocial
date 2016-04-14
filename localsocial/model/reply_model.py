from localsocial.model.location_model import Location
from localsocial.service.picture import filesystem_storage_service

class Reply:
	def __init__(self, post_id, author_id, author_name, author_portrait, body, reply_date, location, privacy, edited):
		if not isinstance(location, Location):
			raise ValueError("argument 'location' must be a Location object")

		self.reply_id = -1
		self.post_id = post_id
		self.author_id = author_id
		self.author_name = author_name
		self.author_portrait = author_portrait
		self.reply_body = body
		self.reply_date = reply_date
		self.location = location
		self.privacy = privacy
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
		reply_dict = {}
		reply_dict["reply_id"] = self.reply_id
		reply_dict["post_id"] = self.post_id
		reply_dict["author_id"] = self.author_id
		reply_dict["author_name"] = self.author_name
		reply_dict["portrait_src"] = filesystem_storage_service.get_cropped_src(self.author_portrait, self.author_id)
		reply_dict["reply_body"] = self.reply_body
		reply_dict["reply_date"] = self.reply_date.isoformat("T")
		reply_dict["location"] = self.location.to_json_dict()
		reply_dict["privacy"] = self.privacy
		reply_dict["edited"] = self.edited

		return reply_dict