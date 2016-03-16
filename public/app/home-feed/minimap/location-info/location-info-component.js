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
					return <div className="post-entry">
						<img src={post['portrait_src']} />
						<span className="post-author-name">{ post['author_name'] }</span>
						<span className="post-body">{ post['body'] }</span>
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