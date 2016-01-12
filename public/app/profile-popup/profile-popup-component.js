define([
	'components/popup-service',
	'components/user-service',
	'home-feed/feed/feed-component',
	'profile-popup/user-relation-status/user-relation-status-component',
	'react'
], function(
	PopupService,
	UserService,
	Feed,
	UserRelationStatus,
	React
) {
	'use strict';

	var ProfilePopup = React.createClass({
		getInitialState() {
			return {};
		},
		componentWillMount() {
			var component = this;
			
			UserService.getUserProfile(this.props.userId).then(function(profile) {
				component.setState({ profile });
			});
		},
		render() {
			if(this.state.profile) {
				var currentUser = this.state.profile.current_user_info;

				var friendsElements = this.state.profile.friends.map((friend) => {
					return <div className="friend-entry">
						<img className="friend-portrait" src="/portrait/test" />
						<div key={friend.user_id} className="friend-name">{ friend.firstName + ' ' + friend.lastName }</div>
					</div>;
				});

				var followersString = String(this.state.profile.follower_count);
				if(this.state.profile.follower_count !== 1) {
					followersString += ' Followers';
				}
				else {
					followersString += ' Follower';
				}

				return <div className="user-profile-popup">
					<img className="profile-portrait" src="/portrait/test" />
					<div className="profile-info">
						<h1 className="profile-name">{ this.state.profile.firstName + ' ' + this.state.profile.lastName }</h1>
						<div className="profile-followers">{ followersString }</div>
						<UserRelationStatus 
							updateProfile={this.updateProfile}
							following={currentUser.following}
							friendship={currentUser.friendship_status}
							userId={this.state.profile.userId}
						/>
					</div>
					<div className="friends">
						<h2>Friends</h2>
						{ friendsElements }
					</div>
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
			var component = this;

			UserService.getUserProfile(this.props.userId).then(function(profile) {
				component.setState({ profile });
			});
		}
	});

	return ProfilePopup;
});