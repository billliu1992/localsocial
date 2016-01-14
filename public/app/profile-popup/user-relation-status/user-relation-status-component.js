define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	'use strict';

	var UserRelationStatus = React.createClass({
		getInitialState() {
			return {
				confirm : false,
			}
		},
		render() {
			// Do not do anything if self
			if(this.props.isSelf) {
				return null;
			}

			var followElement = null;
			if(this.props.following) {
				followElement = <div className="following-status user-relation-status">
					<div>Following</div>
					<a onClick={this.deleteFollow}>Unfollow</a>
				</div>;
			}
			else {
				followElement = <div className="following-status user-relation-status">
					<a onClick={this.sendFollow}>Follow</a>
				</div>;
			}

			var friendElement = null;
			switch(this.props.friendship) {
				case 'friends':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friends</div>
						<a onClick={this.doConfirm}>Unfriend</a>
					</div>;
					break;
				case 'pending':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friend Request Pending</div>
						<a onClick={this.acceptFriend}>Confirm</a><a onClick={this.doConfirm}>Delete</a>
					</div>;
					break;
				case 'sent':
					friendElement = <div className="friend-status user-relation-status">
						<div>Friend Request Sent</div>
						<a onClick={this.doConfirm}>Cancel Friend Request</a>
					</div>;
					break
				case 'nothing':
					friendElement = <div className="friend-status user-relation-status">
						<a onClick={this.acceptFriend}>Send Friend Request</a>
					</div>
			}

			var confirmClass = '';
			if(this.state.confirm) {
				confirmClass = ' confirm';
			}

			return <div className={'user-relation-info profile-info' + confirmClass}>
				{ followElement }
				{ friendElement }
				<span className="confirm-deletion">Are you sure?
					<a onClick={this.deleteFriend}>Yes</a>
					<a onClick={this.cancelConfirm}>No</a>
				</span>
			</div>;
		},
		sendFollow() {
			UserService.sendFollow(this.props.userId).then(() => {
				this.props.updateProfile();
				this.cancelConfirm();
			});
		},
		deleteFollow() {
			UserService.deleteFollow(this.props.userId).then(() => {
				this.props.updateProfile();
				this.cancelConfirm();
			});
		},
		deleteFriend() {
			UserService.deleteFriend(this.props.userId).then(() => {
				this.props.updateProfile();
				this.cancelConfirm();
			});
		},
		acceptFriend() {
			UserService.sendFriendRequest(this.props.userId).then(() => {
				this.props.updateProfile()
				this.cancelConfirm();
			});
		},
		doConfirm() {
			this.setState({
				confirm : true
			});
		},
		cancelConfirm() {
			this.setState({
				confirm : false
			});
		}
	});

	return UserRelationStatus;
});