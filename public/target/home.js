'use strict';

requirejs.config({
	baseUrl: '/web/',
	paths: {
		'axios': 'bower_components/axios/dist/axios',
		'react': 'bower_components/react/react',
		'react-dom': 'bower_components/react/react-dom',
		'babel-polyfill': 'bower_components/babel-polyfill/browser-polyfill'
	}
});

requirejs(['babel-polyfill', 'home-feed/home-feed-component', 'react', 'react-dom'], function (polyfill, HomeFeed, React, ReactDOM) {
	'use strict';

	ReactDOM.render(React.createElement(HomeFeed, null), document.getElementById('post-feed'));
});