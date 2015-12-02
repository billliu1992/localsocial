define(['axios', 'components/google-maps-service', 'components/coordinates-model'], function(axios, GoogleMapsService, Coordinates) {
	'use strict';

	var GEOIP_API_URL = '/location';

	var LocationService = {
		doBrowserGeolocation() {
			var browserGeolocationPromise = new Promise((resolve, reject) => {
				if(navigator.geolocation) {
					navigator.geolocation.getCurrentPosition((position) => {
						GoogleMapsService.defer().then(() => {
							// TODO maybe reuse
							var geocoder = new google.maps.Geocoder();

							geocoder.geocode({
								location : {
									lat : position.coords.latitude,
									lng : position.coords.longitude
								}
							},
							(results, status) => {
								if(status === google.maps.GeocoderStatus.OK) {
									var cityName = null;

									if(results && results[0]) {
										for(var componentIdx in results[0].address_components) {
											var addressComponent = results[0].address_components[componentIdx];

											if(addressComponent.types.indexOf('locality') !== -1) {
												var userLocation = new Coordinates(addressComponent.short_name, position.coords.longitude, position.coords.latitude);

												resolve(userLocation);

												return;
											}
										}
									}
									else {
										reject();
									}
								}
								else {
									reject();
								}
							});
						});
					}, (error) => {
						reject();
					});
				}
				else {
					reject();
				}
			});

			return browserGeolocationPromise;
		}
	};

	return LocationService;
});