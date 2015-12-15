define([
	'components/post-service',
	'react'
], function(
	PostService,
	React
) {
	'use strict';

	var Post = React.createClass({
		formatDistanceForDisplay(postCoords, feedCoords) {
			if(feedCoords.city !== postCoords.city) {
				return postCoords.city;
			}
			else {
				return PostService.getDistance(postCoords, feedCoords, true);
			}
		},
		
		render() {
			var dateObject = new Date(this.props.post['post_date']);

			return (
				<div>
					<span>Author:</span><span>{ this.props.post['author_name'] }</span>
					<span>{ this.formatDistanceForDisplay(this.props.post['location'], this.props.location) }</span>
					<div>
						{ this.props.post['body'] }
					</div>
					<span>{ dateObject.toString() }</span>
					<span>{ this.props.post['privacy'] }</span>
					<hr />
				</div>
			);
		}
	});

	return Post;
});