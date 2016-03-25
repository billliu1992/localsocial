requirejs.config({
	baseUrl: '/web/',
	paths : {
		'axios' : 'bower_components/axios/dist/axios',
		'react' : 'bower_components/react/react',
		'react-dom' : 'bower_components/react/react-dom',
		'babel-polyfill' : 'bower_components/babel-polyfill/browser-polyfill'
	}
});

requirejs([
	'babel-polyfill',
	'home-feed/home-feed-component',
	'top-nav/top-nav-component',
	'sidebar/sidebar-component',
	'react',
	'react-dom',
	'components/location-service',
	'components/user-service'
], function(
	polyfill,
	HomeFeed,
	TopNav,
	Sidebar,
	React,
	ReactDOM,
	LocationService,
	UserService
) {
	'use strict';

	UserService.getCurrentUserInfo().then((user) => {
		if(user.preferences['browser_geo']) {
			LocationService.useBrowserGeolocation = true;
		}
		
		if(user['current_location']) {
			LocationService.cachedLocation = user['current_location'];
		}
	});

	ReactDOM.render(
		<HomeFeed />,
		document.getElementById('post-feed')
	);

	ReactDOM.render(
		<Sidebar />,
		document.getElementById('left-bar')
	);

	ReactDOM.render(
		<TopNav />,
		document.getElementById('top-nav-bar')
	);
});