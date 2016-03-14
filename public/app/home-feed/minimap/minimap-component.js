define([
	'components/google-maps-service',
	'react'
], function(
	GoogleMapsService,
	React
) {
	'use strict';

	var Minimap = React.createClass({
		componentDidMount() {
			GoogleMapsService.defer().then(() => {
				var map = new google.maps.Map(this.refs.map, {
					center : {
						lat : 40.0990071,
						lng : -88.2183973
					},
					zoom: 12
				});
			});
		},
		render() {
			return <div className="feed-minimap">
				<div className="map-node" ref="map"></div>
			</div>
		}
	});

	return Minimap;
});