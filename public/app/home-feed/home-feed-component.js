define([
	'home-feed/feed/feed-component', 
	'home-feed/post-form/post-form-component',
	'profile-popup/profile-popup-component',
	'home-feed/minimap/minimap-component',
	'components/post-service',
	'components/user-service',
	'components/popup-service',
	'components/user-profile-mixin',
	'components/message-enabled-mixin',
	'components/infinite-scroll-mixin',
	'react'
], 
function(
	Feed, 
	NewPostForm,
	ProfilePopup,
	Minimap,
	PostService,
	UserService,
	PopupService,
	UserProfileMixin,
	MessageEnabledMixin,
	InfiniteScrollMixin,
	React
) {
	'use strict';

	var FETCH_THRESHOLD = 300;

	var HomeFeed = React.createClass({
		mixins : [UserProfileMixin, MessageEnabledMixin, InfiniteScrollMixin],
		getInitialState() {
			return {
				posts: []
			};
		},
		componentWillMount() {
			this.getNewPosts();

			// Attach event listener to the whole page
			window.addEventListener('scroll', () => {
				// Quirky Chrome/Firefox difference
				var target = document.documentElement;
				if(target.scrollTop === 0) {
					target = document.body;
				}

				this.doInfiniteScrollElement(target, FETCH_THRESHOLD, (maxId, page, finish, noMore) => {
					PostService.getPosts(maxId, page).then((data) => {
						var posts = this.state.posts;

						if(data.posts.length !== 0) {
							posts.push(...data.posts);

							this.setState({
								posts
							}, () => {
								finish();
							});
						}
						else {
							noMore();
						}
					});
				})
			});
		},
		render() {
			return <div className="home-feed-wrapper">
				<div className="home-feed-area">
					<div className={ 'home-feed-message ' + this.getMessageClass() }>{this.getMessageText()}</div>
					<NewPostForm onSubmit={ this.submitPost } />
					<Feed posts={ this.state.posts } location={ this.state.location } showProfile={ this.showProfile } />
				</div>
				<Minimap />
			</div>
		},

		getNewPosts() {
			PostService.getPosts().then(
				(data) => {
					this.setState({ 
						posts : data.posts,
						location : data['current_location']
					});

					this.setScrollMaxId(data['max_id']);
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