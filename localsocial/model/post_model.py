class Post(object):
	def __init__(self, author_id, author_name, body, post_date, privacy, city_name, loc_long, loc_lat):
		self.post_id = -1

		self.author_id = author_id
		self.author_name = author_name
		self.body = body
		self.post_date = post_date
		self.privacy = privacy
		self.city_name = city_name
		self.longitude = loc_long
		self.latitude = loc_lat


class EventPost(Post):
	def __init__(self, author_id, author_name, body, post_date, privacy, city_name, loc_long, loc_lat, event_id, event_name, event_location, event_start, event_end):
		super(author_id, author_name, body, post_date, privacy, city_name, loc_long, loc_lat)

		self.event_id = event_id
		self.event_name = event_name
		self.event_location = event_location
		self.event_start = event_start
		self.event_end = event_end

class ImagePost(Post):
	def __init__(self, author_id, author_name, body, post_date, privacy, city_name, loc_long, loc_lat, image_id):
		super(author_id, author_name, body, post_date, post_date, privacy, city_name, loc_long, loc_lat)

		self.image_id = image_id