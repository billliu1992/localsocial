define(['react', 'home-feed/feed/post/post-component'], function(React, Post) {
	'use strict';

	var Feed = React.createClass({
		render() {
			if(this.props.posts) {
				var posts = this.props.posts.map((post) => (
					<Post key={ post['post_id'] } post={ post } location={ this.props.location } showProfile={ this.props.showProfile }/>
				));

				return <div className="posts-feed">
						{posts}
					</div>
			}
			else {
				return <div className="posts-feed">Loading</div>
			}
		}
	});

	return Feed;
});
