define([], function() {
	var Coordinates = function(cityName, longitude, latitude) {
		this.city = cityName;
		this.longitude = longitude;
		this.latitude = latitude;
	};

	return Coordinates;
});