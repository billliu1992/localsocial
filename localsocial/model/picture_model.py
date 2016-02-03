class UploadedPicture(object):
	def __init__(self, author_id, uploaded_date, original_filename, hashed_name, location, title, description, privacy):
		self.picture_id = -1
		self.author_id = author_id
		self.uploaded_date = uploaded_date
		self.original_filename = original_filename
		self.hashed_name = hashed_name
		self.title = title
		self.description = description
		self.privacy = privacy
		self.location = location