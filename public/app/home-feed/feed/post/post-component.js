define([
	'components/post-service',
	'home-feed/feed/post/replies/replies-component',
	'react'
], function(
	PostService,
	Replies,
	React
) {
	'use strict';

	var formatDistanceForDisplay = function(postCoords, feedCoords) {
		if(!feedCoords || postCoords.latitude === null || postCoords.longitude === null || feedCoords.city !== postCoords.city) {
			return postCoords.city;
		}
		else {
			return PostService.getDistance(postCoords, feedCoords, true) + ' miles away';
		}
	}

	var formatTimeForDisplay = function(time) {
		var currentTime = new Date();

		var difference = currentTime - time;

		var buildString = function(diff, oneUnitInMillis, unitName) {
			var numberOfUnits = Math.floor(diff / oneUnitInMillis);
			if(numberOfUnits > 1) {
				unitName += 's';
			}

			return numberOfUnits + ' ' + unitName + ' ago';
		}

		if(difference / (1000 * 60 * 60 * 24 * 365) >= 1) {
			return buildString(difference, (1000 * 60 * 60 * 24 * 365), "year");
		}
		else if(difference / (1000 * 60 * 60 * 24 * 30) >= 1) {
			// We naively assume each month is 30 days
			return buildString(difference, (1000 * 60 * 60 * 24 * 30), "month");
		}
		else if(difference / (1000 * 60 * 60 * 24) >= 1) {
			return buildString(difference, (1000 * 60 * 60 * 24), "day");
		}
		else if(difference / (1000 * 60 * 60) >= 1) {
			return buildString(difference, (1000 * 60 * 60), "hour");
		}
		else if(difference / (1000 * 60 * 60) >= 1) {
			return buildString(difference, (1000 * 60), "minute");
		}
		else {
			return "less than a minute ago";
		}
	}

	var formatPrivacyForDisplay = function(privacyString) {
		if(privacyString === 'friends') {
			return 'Private';
		}
	}

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
							<span className="post-private post-info">{ formatPrivacyForDisplay(displayedPost['privacy']) }</span>
						</div>
						<div className="post-header-row">
							<span className="post-location post-info">{ formatDistanceForDisplay(displayedPost['location'], this.props.location) }</span>
							<span className="post-date post-info">{ formatTimeForDisplay(dateObject) }</span>
						</div>
					</div>
					<div className="post-body">
						{ displayedPost['body'] }
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