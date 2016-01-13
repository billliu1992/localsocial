define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	'use strict';

	var UserRelationStatus = React.createClass({
		render() {
			var component = this;

			var followElement = null;
			if(this.props.following) {
				var deleteFollow = function() {
					UserService.deleteFollow(component.props.userId).then(() => component.props.updateProfile());
				}

				followElement = <div className="following-status user-relation-status">
					<div>Following</div>
					<a onClick={deleteFollow}>Unfollow</a>
				</div>;
			}
			else {
				var sendFollow = function() {
					UserService.sendFollow(component.props.userId).then(() => component.props.updateProfile());
				}

				followElement = <div className="following-status user-relation-status">
					<a onClick={sendFollow}>Follow</a>
				</div>;
			}

			var friendElement = null;
			var confirmClass = '';
			var deleteFriend = function() {
				UserService.deleteFriend(component.props.userId).then(() => component.props.updateProfile());
			}
			var acceptFriend = function() {
				UserService.sendFriendRequest(component.props.userId).then(() => component.props.updateProfile());
			}
			var doConfirm = function() {
				confirmClass = ' confirm';
			}
			var cancelConfirm = function() {
				confirmClass = '';
			}
			switch(this.props.friendship) {
				case 'friends':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friends</div>
						<a onClick={doConfirm}>Unfriend</a>
					</div>;
					break;
				case 'pending':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friend Request Pending</div>
						<a onClick={acceptFriend}>Confirm</a><a onClick={doConfirm}>Delete</a>
					</div>;
					break;
				case 'sent':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friend Request Sent</div>
						<a onClick={doConfirm}>Cancel Friend Request</a>
					</div>;
					break
				case 'nothing':
					friendElement = <div className="friend-status user-relation-status">
						<a onClick={acceptFriend}>Send Friend Request</a>
					</div>
			}

			return <div className={'user-relation-info' + confirmClass}>
				{ followElement }
				{ friendElement }
				<span className="confirm-deletion">Are you sure?
					<a onClick={deleteFriend}>Yes</a>
					<a onClick={cancelConfirm}>No</a>
				</span>
			</div>;
		}
	});

	return UserRelationStatus;
});