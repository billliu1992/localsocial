var doGoogleMapsLoaded = null;

var _googleMapsPromise = new Promise((resolve, reject) => {
	doGoogleMapsLoaded = function() {
		resolve();
	};
});

define(['config'], function(Config) {

	//TODO async and defer?
	var googleMapsInclude = document.createElement('script');
	googleMapsInclude.src = 'https://maps.googleapis.com/maps/api/js?key=' + Config.G_MAPS_API_KEY + '&callback=doGoogleMapsLoaded';
	document.getElementsByTagName('head')[0].appendChild(googleMapsInclude);

	var GoogleMapsService = {
		defer() {
			return _googleMapsPromise;
		}
	}

	return GoogleMapsService;
});