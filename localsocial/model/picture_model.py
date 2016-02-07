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