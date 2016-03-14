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

	var Minimap = React.createClass({
		getInitialState() {
			return {
				mapRef : null,
				shown : true,
				showLocationInfo : false,
				postsRendered : 0
			};
		},
		componentDidMount() {
			GoogleMapsService.defer().then(() => {
				var mapRef = new google.maps.Map(this.refs.map, {
					center : {
						lat : this.props.location.latitude,
						lng : this.props.location.longitude
					},
					maxWidth: 100,
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
				});
			});
		},
		componentWillReceiveProps(nextProps) {
			GoogleMapsService.defer().then(() => {
				this.props.postAggregator.renderAll(this.state.mapRef, (posts, pos) => {
					this.createInfoWindowNode(posts, pos);

					this.openLocationInfoWindow();
				});
			});
		},
		render() {
			var mapClass = 'feed-minimap';
			var controlText = 'Hide map';
			if(!this.state.shown) {
				mapClass += ' hidden';
				controlText = 'Show map';
			}

			return <div className={ mapClass }>
				<div className="map-controls">
					<a onClick={this.toggleMapShown}>{ controlText }</a>
				</div>
				<div className="map-node" ref="map"></div>
				<LocationInfoComponent posts={this.state.currentPosts} shown={this.state.showLocationInfo} closeWindow={this.closeLocationInfoWindow} />
			</div>
		},
		createInfoWindowNode(posts) {
			this.setState({
				currentPosts : posts
			});
		},
		toggleMapShown(event) {
			this.setState({
				shown : !this.state.shown
			});
		},
		openLocationInfoWindow() {
			this.setState({
				showLocationInfo : true
			});
		},
		closeLocationInfoWindow() {
			this.setState({
				showLocationInfo : false
			});
		}
	});

	return Minimap;
});