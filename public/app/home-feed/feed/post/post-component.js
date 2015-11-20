define(['components/post-service', 'react'], function(axios, React) {
	'use strict';

	var Post = React.createClass({
		render() {
			var dateObject = new Date(this.props.post['post_date']);

			return (
				<div>
					<span>Author:</span><span>{ this.props.post['author_name'] }</span>
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