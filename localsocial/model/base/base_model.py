class BaseModel(object):
	def __init__(self, primary_key_id, new_row):
		self.is_new_row = new_row
		self.id = primary_key_id