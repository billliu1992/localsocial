'use strict';

define(['react', 'components/post-service', 'home-feed/feed/feed-component', 'home-feed/post-form/post-form-component'], function (React, PostService, Feed, NewPostForm) {
	'use strict';

	var HomeFeed = React.createClass({
		displayName: 'HomeFeed',
		getInitialState: function getInitialState() {
			return {
				posts: [],
				pageNum: 0
			};
		},
		componentWillMount: function componentWillMount() {
			this.getNewPosts();
		},
		render: function render() {
			return React.createElement(
				'div',
				{ className: 'home-feed-area' },
				React.createElement(NewPostForm, { onSubmit: this.submitPost }),
				React.createElement(Feed, { posts: this.state.posts })
			);
		},
		getNewPosts: function getNewPosts() {
			var _this = this;

			PostService.getPosts().then(function (data) {
				_this.setState({ posts: data.posts });
			}, function (error) {
				// TODO error state
				console.log("Error", error);
			});
		},
		submitPost: function submitPost(newPost) {
			PostService.savePost(newPost);

			this.getNewPosts();
		}
	});

	return HomeFeed;
});