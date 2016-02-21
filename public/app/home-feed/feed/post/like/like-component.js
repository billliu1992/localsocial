define([
	'components/post-service',
	'react'
], function(
	PostService,
	React
) {
	'use strict';

	var Like = React.createClass({
		getInitialState() {
			return {
				changed : false
			}
		},
		render() {
			var liked = (this.props.liked && !this.state.changed) || (!this.props.liked && this.state.changed);

			var likeCount = this.props.likes;
			var likeClass = null;
			var likeText = null;
			if(liked) {
				if(this.state.changed) {
					likeCount += 1;
				}
				likeClass = 'liked';
				likeText = 'You like this ';
			}
			else {
				if(this.state.changed) {
					likeCount -= 1;
					// Technically shouldn't happen
					if(likeCount < 0) {
						likeCount = 0;
					}
				}
				likeClass = '';
				likeText = 'Likes ';
			}


			return <span className={ 'post-like ' + likeClass + ' ' + this.props.className } onClick={ this.doLikeClick }>
				{likeText} ({likeCount})
			</span>
		},
		doLikeClick(event) {
			var liked = (this.props.liked && !this.state.changed) || (!this.props.liked && this.state.changed);

			if(liked) {
				PostService.unlikePost(this.props.postId).then((response) => {
					this.setState({
						changed : this.props.liked	// Set changed depending on the original value of liked
					});
				});
			}
			else {
				PostService.likePost(this.props.postId).then((response) => {
					this.setState({
						changed : !this.props.liked	// Set changed depending on the original value of liked
					});
				});
			}
		}
	});

	return Like;
});