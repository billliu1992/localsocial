from localsocial.model.location_model import Location

def build_name(first_name, nick_name, last_name, are_friends, show_last_name):
	if (not are_friends) and (not show_last_name):
		last_name = last_name[0:1] + "."

	if nick_name != None:
		author_name = nick_name + " " + last_name
	else:
		author_name = first_name + " " + last_name

	return author_name

def build_location(longitude, latitude, city_name, are_friends, exact_location):
	if (not are_friends) and (not exact_location):
		longitude = None
		latitude = None
		
	return Location(city_name, longitude, latitude)