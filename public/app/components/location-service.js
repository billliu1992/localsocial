define(['axios', 'components/google-maps-service'], function(axios, GoogleMapsService) {
	'use strict';

	var GEOIP_API_URL = '/location';

	var UserLocation = function(cityName, longitude, latitude) {
		this.cityName = cityName;
		this.longitude = longitude;
		this.latitude = latitude;
	};

	var doGeolocation = function() {
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
											resolve(addressComponent.short_name);

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
	};

	var doGeoip = function() {
		var geoipApiRequestPromise = new Promise((resolve, reject) => {
			axios.get(GEOIP_API_URL)
				.then((response) => {
					resolve(new UserLocation(response.city, response.longitude, response.latitude));
				})
				.catch((response) => {
					if(errorCallback) {
						reject({ statusCode : response.status, data : response.data });
					}
				});
		});
	};

	var currentLocationPromise = new Promise((resolve, reject) => {
		doGeolocation().then((position) => {
			resolve(position);
		},
		() => {
			doGeoip().then((position) => {
				resolve(position);
			},
			() => {
				reject(position);
			});
		});
	});

	var LocationService = {
		getLocation() {
			return currentLocationPromise;
		}
	};

	return LocationService;

});