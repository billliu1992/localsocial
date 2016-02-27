define([
	'components/post-service',
	'home-feed/feed/post/replies/replies-component',
	'home-feed/feed/post/like/like-component',
	'react'
], function(
	PostService,
	Replies,
	Like,
	React
) {
	'use strict';

	var Post = React.createClass({
		getInitialState() {
			return {
				updatedPost : null
			};
		},
		render() {
			var displayedPost = this.props.post;
			if(this.state.updatedPost !== null) {
				displayedPost = this.state.updatedPost;
			}

			var dateObject = new Date(this.props.post['post_date']);

			return (
				<div className="feed-post pod">
					<div className="portrait-wrap">
						<img className="portrait" src={ displayedPost['portrait_src'] } />
					</div>
					<div className="post-header">
						<div className="post-header-row">
							<a className="post-author" onClick={this.showUserProfile}>{ displayedPost['author_name'] }</a>
							<span className="post-private post-info">{ PostService.formatPrivacyForDisplay(displayedPost['privacy']) }</span>
						</div>
						<div className="post-header-row">
							<span className="post-location post-info">{ PostService.formatDistanceForDisplay(displayedPost['location'], this.props.location) }</span>
							<span className="post-date post-info">{ PostService.formatTimeForDisplay(dateObject) }</span>
						</div>
					</div>
					<div className="post-body">
						{ displayedPost['body'] }
					</div>
					<div className="post-controls">
						<Like postId={ displayedPost['post_id'] } likes={ displayedPost['likes'] } liked = { displayedPost['liked'] } />
					</div>
					<Replies
						replies={ displayedPost['replies'] }
						postId={ displayedPost['post_id'] }
						location={ this.props.location }
						updatePost={ this.updatePost }
					/>
				</div>
			);
		},
		updatePost(updatedPost) {
			this.setState({
				updatedPost
			});
		},
		showUserProfile() {
			this.props.showProfile(this.props.post['author_id']);
		}
	});

	return Post;
});