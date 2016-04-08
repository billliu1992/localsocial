define([
	'components/popup-service',
	'components/user-service',
	'upload-pic-popup/upload-pic-popup-component',
	'profile-popup/profile-feed/profile-feed-component',
	'profile-popup/user-relation-status/user-relation-status-component',
	'profile-popup/biography/biography-component',
	'profile-popup/friends-list/friends-list-component',
	'react'
], function(
	PopupService,
	UserService,
	UploadPicPopup,
	ProfileFeed,
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
				var currentUser = this.state.profile['current_user_info'];

				var followersString = String(this.state.profile['follower_count']);
				if(this.state.profile['follower_count'] !== 1) {
					followersString += ' Followers';
				}
				else {
					followersString += ' Follower';
				}

				var updatePictureElem = null;
				if(this.state.profile.self) {
					updatePictureElem = <a className="change-profile-portrait" onClick={this.showUploadPopup}>Update Profile Picture</a>;
				}

				return <div className="user-profile-popup">
					<img className="profile-portrait" src={ this.state.profile['portrait_src'] } />
					{updatePictureElem}
					<h1 className="profile-name">{ this.state.profile['first_name'] + ' ' + this.state.profile['last_name'] }</h1>
					<div className="profile-followers profile-info">{ followersString }</div>
					<UserRelationStatus 
						updateProfile={this.updateProfile}
						following={currentUser.following}
						friendship={currentUser.friendship_status}
						userId={this.state.profile['user_id']}
						isSelf={this.state.profile.self}
					/>
					<Biography
						onChange={this.updateProfile}
						biography={this.state.profile.biography}
						isSelf={this.state.profile.self}
					/>
					<FriendsList friends={this.state.profile.friends} showProfilePopup={this.showProfilePopup} />
					<ProfileFeed userId={this.state.profile['user_id']} posts={this.state.profile.posts} location={ currentUser.location } getNextPagePosts={ this.getNextPagePosts } />
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
		},
		getNextPagePosts(newPosts) {
			var oldProfile = this.state.profile;

			oldProfile.posts.push(...newPosts);

			this.setState({
				profile : oldProfile
			});
		},
		showProfilePopup(userId) {
			PopupService.updatePopup({ userId : userId });
		},
		showUploadPopup() {
			PopupService.showPopup(UploadPicPopup);
		}
	});

	return ProfilePopup;
});