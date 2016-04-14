define([
	'home-feed/feed/post/delete/delete-component',
	'components/post-service',
	'components/popup-service',
	'react'
], function(
	Delete,
	PostService,
	PopupService,
	React
) {
	'use strict';

	var Reply = React.createClass({
		getInitialState() {
			return {
				isDeleted : false
			}
		},
		render() {
			if(this.state.isDeleted) {
				return null;
			}

			var locationElement = null;
			if(this.props.location.city !== this.props.reply.location.city) {
				locationElement = <span className="reply-location">this.props.reply.location.city</span>;
			}

			var dateObject = new Date(this.props.reply['reply_date']);

			return <div className="reply">
					<img src={this.props.reply['portrait_src']} />
					<div className="reply-info">
						<a className="reply-author" onClick={this.showUserProfile}>{ this.props.reply['author_name'] }</a>
						<div className="reply-meta">
							<span className="reply-meta-entry reply-location">{ PostService.formatDistanceForDisplay(this.props.reply.location, this.props.location) }</span>
							<span className="reply-meta-entry reply-date">{ PostService.formatTimeForDisplay(dateObject) }</span>
							<Delete className="reply-meta-entry delete-reply" authorId={this.props.reply['author_id']} onConfirm={ this.deleteReply }>Delete</Delete>
						</div>
					</div>
					<div className="reply-body"> { this.props.reply['reply_body'] } </div>
				</div>
		},
		showUserProfile() {
			this.props.showProfile(this.props.reply['author_id']);
		},
		deleteReply() {
			return PostService.deleteReply(this.props.reply['reply_id']).then((data) => {
				if(data.error !== true) {
					this.setState({
						isDeleted : true
					});
				}
			});
		}
	});

	return Reply;
});