define([
	'axios',
	'components/google-maps-service',
	'components/coordinates-model'
], function(
	axios,
	GoogleMapsService,
	Coordinates
) {
	'use strict';

	var BROWSER_GEOLOCATION_TIMEOUT = 5000;

	var LocationService = {
		useBrowserGeolocation : false,
		cachedLocation : null,

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
						// Turn off browser geolocation if browser geolocation fails
						this.useBrowserGeolocation = false;

						reject();
					}, {
						timeout: BROWSER_GEOLOCATION_TIMEOUT
					});
				}
				else {
					reject();
				}
			});

			return browserGeolocationPromise;
		},
		getLocation(useCache) {
			return new Promise((resolve, reject) => {
				var browserGeolocation = this.useBrowserGeolocation ? this.doBrowserGeolocation() : Promise.reject();

				browserGeolocation.then((position) => {
					resolve(position);
				}, () => {
					if(useCache) {
						resolve(this.cachedLocation);
					}
					else {
						resolve(null);
					}
				});
			});
		}
	};

	return LocationService;
});