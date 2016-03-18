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

	var PostsLocationMarker = function() {
		this.posts = [];
		this.marker = null;
	};
	PostsLocationMarker.prototype = {
		pushPost(post) {
			this.posts.push(post);
		},
		render(mapRef, location, onClickCallback) {
			this.marker = new google.maps.Marker({
				position: {
					lat : location['latitude'],
					lng : location['longitude']
				},
				map: mapRef,
				title: 'Mark'
			});

			this.marker.addListener('click', () => {
				onClickCallback(this.posts, this.marker.getPosition());
			});
		}
	}

	var PostsLocationAggregator = function() {
		this.posts = {}
	};
	PostsLocationAggregator.prototype = {
		pushPost(post) {
			var location = post.location;
			var decimalPlaces = 5;

			var roundingFactor = Math.pow(10, decimalPlaces);
			var roundedLat = Math.round(location['latitude'] * roundingFactor) / roundingFactor;
			var roundedLong = Math.round(location['longitude'] * roundingFactor) / roundingFactor;

			if(typeof this.posts[roundedLat] === 'undefined') {
				this.posts[roundedLat] = {};
			}
			if(typeof this.posts[roundedLat][roundedLong] === 'undefined') {
				this.posts[roundedLat][roundedLong] = new PostsLocationMarker();
			}
			this.posts[roundedLat][roundedLong].pushPost(post);
		},
		renderAll(mapRef, callback) {
			for(var lat in this.posts) {
				for(var long in this.posts[lat]) {
					var latitude = Number(lat);
					var longitude = Number(long);
					this.posts[lat][long].render(mapRef, { latitude, longitude }, callback);
				}
			}
		}
	};

	var postAggregator = null;

	var Minimap = React.createClass({
		getInitialState() {
			return {
				mapRef : null,
				shown : true
			};
		},
		componentDidMount() {
			postAggregator = new PostsLocationAggregator();

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
				}, () => {
					this.buildMarkers();
				});
			});
		},
		buildMarkers() {
			for(var post of this.props.posts) {
				postAggregator.pushPost(post);
			}

			postAggregator.renderAll(this.state.mapRef, (posts, pos) => {
				this.createInfoWindowNode(posts, pos);
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
				<LocationInfoComponent posts={this.state.currentPosts}/>
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
		}
	});

	return Minimap;
});