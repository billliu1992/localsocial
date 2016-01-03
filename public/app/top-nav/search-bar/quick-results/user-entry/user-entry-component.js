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
			if(this.props.entry['is_following']) {
				followText = 'Unfollow';
				followClass += ' following';
				followClick = this.sendUnfollow;
			}

			var friendText = 'Friend';
			var friendClass = 'friend';
			var friendClick = this.sendFriendRequest;
			switch(this.props.entry['friend_status']) {
				case('friends'):
					friendText = 'Friends';
					friendClass += ' is-friend';
					friendClick = function() {};
					break;
				case('pending'):
					friendText = 'Accept Friend Request';
					break;
				case('sent'):
					friendText = 'Request Sent';
					friendClass += ' request-sent';
					friendClick = function() {};
					break;
			}


			return <div className="user-entry">
				<img src="/portrait/test" />
				<span className="user-name">{this.props.entry.name}</span>
				<span className="user-control">
					<span className={followClass} onClick={followClick}>{followText}</span>
					<span className={friendClass} onClick={friendClick}>{friendText}</span>
				</span>
			</div>;
		},

		sendFriendRequest() {
			UserService.sendFriendRequest(this.props.entry.user_id).then(() => {
				this.props.onChange();
			});
		},
		sendFollow() {
			UserService.sendFollow(this.props.entry.user_id).then(() => {
				this.props.onChange();
			});
		},
		sendUnfollow() {
			UserService.deleteFollow(this.props.entry.user_id).then(() => {
				this.props.onChange();
			});
		}
	});

	return UserEntry;
});