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
					return <div className="post-entry" key={post['post_id']}>
						<img src={post['portrait_src']} />
						<span className="post-text">
							<span className="post-author-name">{ post['author_name'] }</span>
							<span className="post-body">{ post['body'] }</span>
						</span>
					</div>;
				});

				return <div className="location-info-window">
					<div className="location-window-close" onClick={ this.props.closeWindow }>x</div>
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