define([
	'components/popup-service',
	'components/user-service',
	'home-feed/feed/feed-component',
	'profile-popup/user-relation-status/user-relation-status-component',
	'profile-popup/biography/biography-component',
	'profile-popup/friends-list/friends-list-component',
	'react'
], function(
	PopupService,
	UserService,
	Feed,
	UserRelationStatus,
	Biography,
	FriendsList,
	React
) {
	'use strict';

	var ProfilePopup = React.createClass({
		getInitialState() {
			return {};
		},
		componentWillMount() {
			UserService.getUserProfile(this.props.userId).then((profile) => {
				this.setState({ profile });
			});
		},
		componentWillReceiveProps(newProps) {
			if(newProps.userId !== this.props.userId) {
				UserService.getUserProfile(newProps.userId).then((profile) => {
					this.setState({ profile });
				});
			}
		},
		render() {
			if(this.state.profile) {
				var currentUser = this.state.profile.current_user_info;

				var followersString = String(this.state.profile.follower_count);
				if(this.state.profile.follower_count !== 1) {
					followersString += ' Followers';
				}
				else {
					followersString += ' Follower';
				}

				return <div className="user-profile-popup">
					<img className="profile-portrait" src="/portrait/test" />
					<h1 className="profile-name">{ this.state.profile.firstName + ' ' + this.state.profile.lastName }</h1>
					<div className="profile-followers profile-info">{ followersString }</div>
					<UserRelationStatus 
						updateProfile={this.updateProfile}
						following={currentUser.following}
						friendship={currentUser.friendship_status}
						userId={this.state.profile.userId}
						isSelf={this.state.profile.self}
					/>
					<Biography
						onChange={this.updateProfile}
						biography={this.state.profile.biography}
						isSelf={this.state.profile.self}
					/>
					<FriendsList friends={this.state.profile.friends} />
					<div className="profile-feed">
						<Feed posts={this.state.profile.posts} location={ currentUser.location } />
					</div>
				</div>
			}
			else {
				return <div>Loading</div>;
			}
		},
		updateProfile() {
			UserService.getUserProfile(this.props.userId).then((profile) => {
				this.setState({ profile });
			});
		}
	});

	return ProfilePopup;
});