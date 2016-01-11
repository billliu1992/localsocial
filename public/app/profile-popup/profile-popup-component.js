define([
	'components/popup-service',
	'home-feed/feed/feed-component',
	'components/user-service',
	'react'
], function(
	PopupService,
	Feed,
	UserService,
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
					<UserRelationStatus following={currentUser.following} friendship={currentUser.friendship_status}/>
					<div className="friends">
						<h2>Friends</h2>
						{ friendsElements }
					</div>
					<div className="profile-feed">
						<Feed posts={this.state.profile.posts} location={ current_user.location } />
					</div>
				</div>
			}
			else {
				return <div>Loading</div>;
			}
		}
	});

	return ProfilePopup;
});