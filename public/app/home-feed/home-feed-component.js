define([
	'react',
	'components/post-service',
	'components/user-service',
	'components/popup-service',
	'components/user-profile-mixin',
	'components/message-enabled-mixin',
	'profile-popup/profile-popup-component',
	'home-feed/feed/feed-component', 
	'home-feed/post-form/post-form-component'
], 
function(
	React,
	PostService,
	UserService,
	PopupService,
	UserProfileMixin,
	MessageEnabledMixin,
	ProfilePopup,
	Feed, 
	NewPostForm
) {
	'use strict';

	var HomeFeed = React.createClass({
		mixins : [UserProfileMixin, MessageEnabledMixin],
		getInitialState() {
			return {
				posts: [],
				pageNum : 0,
			};
		},
		componentWillMount() {
			this.getNewPosts();
		},
		render() {
			return (
				<div className="home-feed-area">
					<div className={ 'home-feed-message ' + this.getMessageClass() }>{this.getMessageText()}</div>
					<NewPostForm onSubmit={ this.submitPost } />
					<Feed posts={ this.state.posts } location={ this.state.location } showProfile={ this.showProfile } />
				</div>
			);
		},

		getNewPosts() {
			PostService.getPosts().then(
				(data) => {
					this.setState({ posts : data.posts, location : data.current_location });
				},
				(error) => {
					// TODO error state
					console.log("Error", error);
				}
			);
		},

		submitPost(newPost) {
			var locationOverride = UserService.getCustomLocation();

			if(locationOverride) {
				newPost.city = locationOverride.city;
				newPost.longitude = locationOverride.longitude;
				newPost.latitude = locationOverride.latitude;
			}

			this.acknowledgeMessage();

			PostService.savePost(newPost).then((data) => {
				if(data.error === true && data.message) {
					this.setMessage('error', data.message)
				}
				else if(data.error === true) {
					this.setMessage('error', 'An error occurred. Please try again');
				}
			});

			this.getNewPosts();
		},
		showProfile(userId) {
			PopupService.showPopup(ProfilePopup, { userId });
		}
	});

	return HomeFeed;
});