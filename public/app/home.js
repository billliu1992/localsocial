requirejs.config({
	baseUrl: '/web/',
	paths : {
		'axios' : 'bower_components/axios/dist/axios',
		'react' : 'bower_components/react/react',
		'react-dom' : 'bower_components/react/react-dom',
		'babel-polyfill' : 'bower_components/babel-polyfill/browser-polyfill'
	}
});

requirejs(['babel-polyfill', 
	'home-feed/home-feed-component',
	'react',
	'react-dom',
	'components/location-service'
], function(polyfill, HomeFeed, React, ReactDOM, LocationService) {
	'use strict';

	LocationService.getLocation().then((position) => {
		console.log(position);
	},
	(error) => {
		console.log(error);
	});

	ReactDOM.render(
		<HomeFeed />,
		document.getElementById('post-feed')
	);
});