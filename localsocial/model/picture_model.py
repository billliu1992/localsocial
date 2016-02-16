class UploadedPicture(object):
	def __init__(self, author_id, uploaded_date, original_filename, location, title, description, privacy):
		self.picture_id = -1
		self.author_id = author_id
		self.uploaded_date = uploaded_date
		self.original_filename = original_filename
		self.title = title
		self.description = description
		self.privacy = privacy
		self.location = location

	def to_json_dict(self):
		json_dict = self.__dict__
		json_dict['uploaded_date'] = json_dict['uploaded_date'].isoformat("T")
		json_dict['location'] = json_dict['location'].to_json_dict()

		return json_dict

class ProfilePicture(object):
	def __init__(self, uploaded_picture_id, user_id, set_date, crop):
		self.profile_picture_id = -1
		self.uploaded_picture_id = uploaded_picture_id
		self.set_date = set_date
		self.crop = crop

	def to_json_dict(self):
		json_dict = self.__dict__
		json_dict['set_date'] = json_dict['set_date'].isoformat("T")
		json_dict['crop'] = json_dict['crop'].to_json_dict()

		return json_dict

class PictureSection(object):
	def __init__(self, left, top, width, height):
		self.left = left
		self.top = top
		self.width = width
		self.height = height

	@property
	def right(self):
		return self.left + self.width

	@property
	def bottom(self):
		return self.top + self.height

	def to_json_dict(self):
		return self.__dict__