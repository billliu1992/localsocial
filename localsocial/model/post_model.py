from localsocial.model.location_model import Location

class Post(object):
	def __init__(self, author_id, author_name, author_portrait, portrait_set_date, body, post_date, privacy, location):
		self.post_id = -1

		if not isinstance(location, Location):
			raise ValueError("argument 'location' must be a Location object")

		self.author_id = author_id
		self.author_name = author_name
		self.author_portrait = author_portrait
		self.author_portrait_set_date = portrait_set_date
		self.body = body
		self.post_date = post_date
		self.privacy = privacy
		self.location = location

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
		post_dict = {}

		post_dict['author_id'] = self.author_id
		post_dict['author_name'] = self.author_name
		post_dict['author_portrait'] = self.author_portrait
		post_dict['author_portrait_set_date'] = self.author_portrait_set_date.isoformat("T")
		post_dict['body'] = self.body
		post_dict['post_date'] = self.post_date.isoformat("T")
		post_dict['privacy'] = self.privacy
		post_dict['location'] = self.location.to_json_dict()

		return post_dict


class EventPost(Post):
	def __init__(self, author_id, author_name, author_portrait, portrait_set_date, body, post_date, privacy, location, event_id, event_name, event_location, event_start, event_end):
		super(author_id, author_name, author_portrait, portrait_set_date, body, post_date, privacy, location)

		self.event_id = event_id
		self.event_name = event_name
		self.event_location = event_location
		self.event_start = event_start
		self.event_end = event_end

class ImagePost(Post):
	def __init__(self, author_id, author_name, author_portrait, portrait_set_date, body, post_date, privacy, location, image_id):
		super(author_id, author_name, author_portrait, portrait_set_date, body, post_date, post_date, privacy, location)

		self.image_id = image_id

class POST_PRIVACY:
	PUBLIC = 'public'
	HIDE_LOCATION = 'hide_location'
	FRIENDS = 'friends'