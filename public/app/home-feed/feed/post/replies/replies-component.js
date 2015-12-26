define([
	'home-feed/feed/post/replies/reply/reply-component',
	'home-feed/feed/post/replies/new-reply-form/new-reply-form-component',
	'react'
], function(
	Reply,
	NewReplyForm,
	React
) {
	'use strict';
	var Replies = React.createClass({
		render() {
			var replies = this.props.replies.map((reply) => (
				<Reply key={ reply['reply_id'] } reply={ reply } location={ this.props.location } />
			));

			return (
				<div>
					{replies}
					<NewReplyForm location={this.props.location} postId={this.props.postId} />
				</div>
			);
		}
	});

	return Replies;
});
