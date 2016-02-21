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

	var MAX_REPLIES_UNEXPANDED = 2;
	var REPLIES_ADDED = 15;

	var Replies = React.createClass({
		getInitialState() {
			return {
				shownReplies : MAX_REPLIES_UNEXPANDED
			}
		},
		render() {
			var expandElement = null;
			var displayedReplies = this.props.replies;
			if(this.props.replies.length > this.state.shownReplies) {
				expandElement = <div className="expand" onClick={this.doExpand}>Show more replies</div>
				displayedReplies = this.props.replies.slice(this.props.replies.length - this.state.shownReplies);
			}

			var replies = displayedReplies.map((reply) =>
				<Reply key={ reply['reply_id'] } reply={ reply } location={ this.props.location } />
			);

			return (
				<div className="replies-container">
					{ expandElement }
					{ replies }
					<NewReplyForm
						location={this.props.location}
						postId={this.props.postId}
						updatePost={this.props.updatePost}
					/>
				</div>
			);
		},
		doExpand() {
			this.setState({
				shownReplies : this.state.shownReplies + REPLIES_ADDED
			});
		}
	});

	return Replies;
});
