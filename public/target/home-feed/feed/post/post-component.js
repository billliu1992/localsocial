'use strict';

define(['components/post-service', 'react'], function (axios, React) {
	'use strict';

	var Post = React.createClass({
		displayName: 'Post',
		render: function render() {
			var dateObject = new Date(this.props.post['post_date']);

			return React.createElement(
				'div',
				null,
				React.createElement(
					'span',
					null,
					'Author:'
				),
				React.createElement(
					'span',
					null,
					this.props.post['author_name']
				),
				React.createElement(
					'div',
					null,
					this.props.post['body']
				),
				React.createElement(
					'span',
					null,
					dateObject.toString()
				),
				React.createElement(
					'span',
					null,
					this.props.post['privacy']
				),
				React.createElement('hr', null)
			);
		}
	});

	return Post;
});