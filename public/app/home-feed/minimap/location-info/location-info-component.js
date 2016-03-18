define([
	'react'
], function(
	React
) {
	'use strict';

	var LocationInfo = React.createClass({
		render() {
			if(typeof this.props.posts !== 'undefined') {
				var postsElems = this.props.posts.map((post) => {
					// TODO: find a way to wrap correctly and truncate using CSS
					var truncatedBody = post['body'].substring(0, 15);
					if(post['body'].length > 15) {
						truncatedBody += '...';
					}

					return <div className="post-entry" key={post['post_id']}>
						<img src={post['portrait_src']} />
						<span className="post-text">
							<span className="post-author-name">{ post['author_name'] }</span>
							<span className="post-body">{ post['body'].substring(0, 15) }</span>
						</span>
					</div>;
				});

				return <div className="location-info-window">
					{postsElems}
				</div>;
			}
			else {
				return <div>No posts</div>
			}
		}
	});

	return LocationInfo;
});