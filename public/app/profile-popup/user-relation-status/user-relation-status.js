define([
	'react'
], function(
	React
) {
	'use strict';

	var UserRelationStatus = React.createClass({
		render() {
			if() {
			}

			var followingAction = null;
			var followingActionText = null;
			if(this.props.following) {
				followingStatusText = 'Unfollow';
				followingAction = () => UserService.deleteFollow(this.state.profile.userId);
			}
			else {
				followingStatusText = 'Follow';
				followingAction = () => UserService.sendFollow(this.state.profile.userId);
			}

			var friendStatusText = null;
			var friendAction = null;
			var friendActionText = null;
			if(currentUser.friend_status === 'friends') {

			}

			return <div>
				<a onClick={followingAction}>{followingStatusText}</a>
				<
			</div>;
		}
	});

	return UserRelationStatus;
}