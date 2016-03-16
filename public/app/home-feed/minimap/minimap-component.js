define([
	'home-feed/minimap/location-info/location-info-component',
	'components/google-maps-service',
	'react',
	'react-dom'
], function(
	LocationInfoComponent,
	GoogleMapsService,
	React,
	ReactDOM
) {
	'use strict';

	var MarkerCacheService = function(markers) {
	};

	var Minimap = React.createClass({
		getInitialState() {
			return {
				mapRef : null
			};
		},
		componentDidMount() {
			GoogleMapsService.defer().then(() => {
				var mapRef = new google.maps.Map(this.refs.map, {
					center : {
						lat : this.props.location.latitude,
						lng : this.props.location.longitude
					},
					zoom: 12,
					disableDefaultUI: true,
					zoomControl : true
				});

				var infoRef = new google.maps.InfoWindow({
					disableAutoPan : true
				});
				var infoElemRef = document.createElement('div');

				this.setState({
					mapRef,
					infoRef,
					infoElemRef
				}, () => {
					this.buildMarkers();
				});
			});
		},
		buildMarkers() {
			for(var post of this.props.posts) {
				((post) => {
					var mark = new google.maps.Marker({
						position: {
							lat : post['location']['latitude'],
							lng : post['location']['longitude']
						},
						map: this.state.mapRef,
						title: 'Mark'
					});

					mark.addListener('click', () => {
						this.createInfoWindowNode([post], mark.getPosition());
					});
				})(post);
			}
		},
		render() {
			return <div className="feed-minimap">
				<div className="map-node" ref="map"></div>
			</div>
		},
		createInfoWindowNode(posts, pos) {
			ReactDOM.render(<LocationInfoComponent posts={posts}/>, this.state.infoElemRef);

			this.state.infoRef.setPosition(pos);
			this.state.infoRef.setContent(this.state.infoElemRef);
			this.state.infoRef.open(this.state.mapRef);
		}
	});

	return Minimap;
});