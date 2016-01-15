requirejs.config({
	baseUrl: '/web/',
	paths : {
		'axios' : 'bower_components/axios/dist/axios',
		'react' : 'bower_components/react/react',
		'react-dom' : 'bower_components/react/react-dom',
		'babel-polyfill' : 'bower_components/babel-polyfill/browser-polyfill'
	}
});

var doGeolocation = function() {
};

requirejs(['babel-polyfill',
	'home-feed/home-feed-component',
	'top-nav/top-nav-component',
	'react',
	'react-dom',
	'components/location-service',
	'components/user-service'
], function(
	polyfill,
	HomeFeed,
	TopNav,
	React,
	ReactDOM,
	LocationService,
	UserService
) {
	'use strict';

	window.doGeolocation = function() {
		LocationService.doBrowserGeolocation().then(function(location) {
			UserService.setCustomLocation(location);
		});
	};

	ReactDOM.render(
		<HomeFeed />,
		document.getElementById('post-feed')
	);

	ReactDOM.render(
		<TopNav />,
		document.getElementById('top-nav-bar')
	);
});