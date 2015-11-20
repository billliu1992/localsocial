'use strict';

define(['components/post-service', 'react'], function (axios, React) {

	var Post = React.createClass({
		displayName: 'Post',

		render() {
			return React.createElement(
				'div',
				null,
				'Post'
			);
		}
	});

	return Post;
});