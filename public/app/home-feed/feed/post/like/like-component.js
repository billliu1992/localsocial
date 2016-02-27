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
			var likeClass = '';
			if(liked) {
				likeCount += 1;
				likeClass = 'liked';
			}

			return <span className={ 'post-like ' + likeClass } onClick={ this.doLikeClick }>
				Like ({likeCount})
			</span>
		},
		doLikeClick(event) {
			var liked = (this.props.liked && !this.state.changed) || (!this.props.liked && this.state.changed);

			if(liked) {
				PostService.unlikePost(this.props.postId).then((response) => {
					this.setState({
						changed : this.state.liked	// Set changed depending on the original value of liked
					});
				});
			}
			else {
				PostService.likePost(this.props.postId).then((response) => {
					this.setState({
						changed : !this.state.liked	// Set changed depending on the original value of liked
					});
				});
			}
		}
	});

	return Like;
});