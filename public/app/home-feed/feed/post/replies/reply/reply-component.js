define([
	'components/popup-service',
	'react'
], function(
	PopupService,
	React
) {
	'use strict';

	var Reply = React.createClass({
		render() {
			var locationElement = null;
			if(this.props.location.city !== this.props.reply.location.city) {
				locationElement = (<div>this.props.reply.location.city</div>);
			}

			return (
				<div>
					Author: <span onClick={this.showUserProfile}>{ this.props.reply.author_name }</span>
					{ locationElement }
					<div> { this.props.reply.reply_body } </div>
				</div>
			);
		},
		showUserProfile() {
			//PopupService.showPopup('profile-popup/profile-popup-component', { userId : this.props.entry['user_id'] });
		}
	});

	return Reply;
});