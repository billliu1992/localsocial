'use strict';

define(['react', 'home-feed/feed/post/post-component'], function (React, Post) {
	'use strict';

	var Feed = React.createClass({
		displayName: 'Feed',
		render: function render() {
			var posts = this.props.posts.map(function (post) {
				return React.createElement(Post, { key: post['post_id'], post: post });
			});

			return React.createElement(
				'div',
				{ className: 'posts-feed' },
				posts
			);
		}
	});

	return Feed;
});