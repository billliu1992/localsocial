define([
	'profile-popup/profile-popup-component',
	'components/popup-service',
	'components/post-service',
	'react'
], function(
	ProfilePopup,
	PopupService,
	PostService,
	React
) {
	'use strict';

	var LocationInfo = React.createClass({
		render() {
			if(typeof this.props.posts !== 'undefined') {
				var postsElems = this.props.posts.map((post) => {
					return <div className="post-entry" key={post['post_id']} onClick={this.scrollToPost(post['post_id'])}>
						<img src={post['portrait_src']} onClick={this.openProfile(post['author_id'])} />
						<span className="post-text">
							<span className="post-author-name" onClick={this.openProfile(post['author_id'])}>{ post['author_name'] }</span>
							<span className="post-body">{ post['body'] } </span>
							<span className="post-stats">{ post['likes'] } likes { post['replies'].length } replies</span>
						</span>
					</div>;
				});

				var windowClass='location-info-window';
				if(this.props.shown) {
					windowClass += ' shown';
				}

				return <div className={windowClass}>
					<div className="location-window-close" onClick={ this.props.closeWindow }>X</div>
					<div className="post-entries">
						{postsElems}
					</div>
				</div>;
			}
			else {
				return <div className="location-info-window">No posts</div>
			}
		},
		scrollToPost(postId) {
			return () => {
				window.location.hash = '#' + PostService.buildAnchor(postId);
			};
		},
		openProfile(userId) {
			return (event) => {
				event.stopPropagation();

				PopupService.showPopup(ProfilePopup, { userId });
			};
		}
	});

	return LocationInfo;
});