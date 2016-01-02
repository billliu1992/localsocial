define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	var UserEntry = React.createClass({
		render() {
			var followText = 'Follow';
			var followClass = 'follow';
			var followClick = this.sendFollow;
			if(this.props.user.following) {
				followText = 'Following';
				followClass += ' following';
				followClick = function() {};
			}

			var friendText = 'Friend';
			var friendClass = 'friend';
			var friendClick = this.sendFriendRequest;
			if(this.props.user.friends) {
				friendText = 'Friends';
				friendClass = 'is-friend';
				friendClick = function() {};
			}
			else if(this.props.user.is_request_pending) {
				friendText = 'Accept Friend Request';
			}
			else if(this.props.user.request_sent) {
				friendText = 'Request Sent';
				friendClass = 'request-sent';
				friendClick = function() {};
			}


			return <div className="user-entry">
				<img src="/portrait/test" />
				<span className="user-name">{this.props.user.name}</span>
				<span className={followClass} onClick={followClick}>{followText}</span>
				<span className={friendClass} onClick={friendClick}>{friendText}</span>
			</div>;
		},

		sendFriendRequest() {
			UserService.sendFriendRequest(this.props.user.user_id);
		},
		sendFollow() {
			UserService.sendFollowRequest(this.props.user.user_id);
		}
	});

	return UserEntry;
});