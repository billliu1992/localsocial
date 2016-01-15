define(['react', 'home-feed/feed/post/post-component'], function(React, Post) {
	'use strict';

	var Feed = React.createClass({
		render() {
			var posts = this.props.posts.map((post) => (
				<Post key={ post['post_id'] } post={ post } location={ this.props.location } showProfile={ this.props.showProfile }/>
			));

			return (
				
				<div className="posts-feed">
					{posts}
				</div>
				
			);
		}
	});

	return Feed;
});
