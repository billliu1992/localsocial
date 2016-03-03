define([
	'home-feed/feed/feed-component',
	'components/infinite-scroll-mixin',
	'components/user-service',
	'react'
], function(
	Feed,
	InfiniteScrollMixin,
	UserService,
	React
) {
	'use strict';

	var FETCH_THRESHOLD = 300;

	var ProfileFeed = React.createClass({
		mixins : [ InfiniteScrollMixin ],
		componentWillMount() {
			if(this.props.posts.length > 0) {
				this.setScrollMaxId(this.props.posts[0]['post_id']);
			}
		},
		render() {
			return <div className="profile-feed" onScroll={ this.doInfiniteScroll(FETCH_THRESHOLD, this.handleScrollBottom) }>
				<Feed posts={ this.props.posts } location={ this.props.location } />
			</div>;
		},
		handleScrollBottom(maxId, page, finish, noMore) {
			UserService.getUserPosts(this.props.userId, maxId, page).then(
				(data) => {
					this.props.getNextPagePosts(data.posts);

					if(data.posts && data.posts.length === 0) {
						noMore();
					}

					finish();
				},
				(error) => {
					// TODO error state
					console.log("Error", error);
				}
			);
		}
	});

	return ProfileFeed;
});