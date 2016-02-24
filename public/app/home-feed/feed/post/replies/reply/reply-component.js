define([
	'components/post-service',
	'components/popup-service',
	'react'
], function(
	PostService,
	PopupService,
	React
) {
	'use strict';

	var Reply = React.createClass({
		render() {
			var locationElement = null;
			if(this.props.location.city !== this.props.reply.location.city) {
				locationElement = <span className="reply-location">this.props.reply.location.city</span>;
			}

			var dateObject = new Date(this.props.reply['reply_date']);

			return (
				<div className="reply">
					<img src={this.props.reply['portrait_src']} />
					<div className="author-info">
						<span className="reply-author" onClick={this.showUserProfile}>{ this.props.reply['author_name'] }</span>
						<span className="reply-location">{ PostService.formatDistanceForDisplay(this.props.reply.location, this.props.location) }</span>
						<span className="reply-date">{ PostService.formatTimeForDisplay(dateObject) }</span>
					</div>
					<div className="reply-body"> { this.props.reply['reply_body'] } </div>
				</div>
			);
		},
		showUserProfile() {
			//PopupService.showPopup('profile-popup/profile-popup-component', { userId : this.props.entry['user_id'] });
		}
	});

	return Reply;
});