define([
	'home-feed/feed/feed-component', 
	'home-feed/post-form/post-form-component',
	'profile-popup/profile-popup-component',
	'home-feed/minimap/minimap-component',
	'components/post-service',
	'components/user-service',
	'components/popup-service',
	'components/google-maps-service',
	'components/user-profile-mixin',
	'components/message-enabled-mixin',
	'components/infinite-scroll-mixin',
	'components/util',
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
	GoogleMapsService,
	UserProfileMixin,
	MessageEnabledMixin,
	InfiniteScrollMixin,
	Util,
	React
) {
	'use strict';

	var FETCH_THRESHOLD = 300;

	var PostsLocationMarker = function() {
		this.posts = [];
		this.marker = null;
	};
	PostsLocationMarker.prototype = {
		pushPost(post) {
			this.posts.push(post);
		},
		render(mapRef, location, onClickCallback) {
			if(this.marker === null) {
				this.marker = new google.maps.Marker({
					position: {
						lat : location['latitude'],
						lng : location['longitude']
					},
					map: mapRef,
					title: 'Mark'
				});

				this.marker.addListener('click', () => {
					onClickCallback(this.posts, this.marker.getPosition());
				});
			}
		}
	}

	var PostsLocationAggregator = function() {
		this.posts = {}
	};
	PostsLocationAggregator.prototype = {
		pushPost(...newPosts) {
			for(var post of newPosts) {
				var location = post.location;
				
				var decimalPlaces = 5;
				var roundedLat = Util.round(location['latitude'], decimalPlaces);
				var roundedLong = Util.round(location['longitude'], decimalPlaces);


				if(typeof this.posts[roundedLat] === 'undefined') {
					this.posts[roundedLat] = {};
				}
				if(typeof this.posts[roundedLat][roundedLong] === 'undefined') {
					this.posts[roundedLat][roundedLong] = new PostsLocationMarker();
				}
				this.posts[roundedLat][roundedLong].pushPost(post);
			}
		},

		resetPosts() {
			this.posts = {};
		},
		renderAll(mapRef, callback) {
			for(var lat in this.posts) {
				for(var long in this.posts[lat]) {
					var latitude = Number(lat);
					var longitude = Number(long);
					this.posts[lat][long].render(mapRef, { latitude, longitude }, callback);
				}
			}
		}
	};

	var HomeFeed = React.createClass({
		mixins : [UserProfileMixin, MessageEnabledMixin, InfiniteScrollMixin],
		getInitialState() {
			return {
				posts: [],
				location: null,
				postAggregator: null
			};
		},
		componentWillMount() {
			this.getNewPosts();

			this.setState({
				postAggregator : new PostsLocationAggregator()
			});

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
							this.state.postAggregator.pushPost(...data.posts);

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
			var minimapElem = null;
			if(this.state.location !== null) {
				minimapElem = <Minimap location={ this.state.location } postAggregator={this.state.postAggregator} />
			}

			return <div className="home-feed-wrapper">
				<div className="home-feed-area">
					<div className={ 'home-feed-message ' + this.getMessageClass() }>{this.getMessageText()}</div>
					<NewPostForm onSubmit={ this.submitPost } />
					<Feed posts={ this.state.posts } location={ this.state.location } showProfile={ this.showProfile } />
				</div>
				{minimapElem}
			</div>
		},

		getNewPosts() {
			PostService.getPosts().then(
				(data) => {
					this.state.postAggregator.resetPosts();
					this.state.postAggregator.pushPost(...data.posts);

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

				this.getNewPosts();
			});
		},
		showProfile(userId) {
			PopupService.showPopup(ProfilePopup, { userId });
		}
	});

	return HomeFeed;
});