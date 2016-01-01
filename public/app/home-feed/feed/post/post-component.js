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

	var Post = React.createClass({
		formatDistanceForDisplay(postCoords, feedCoords) {
			if(feedCoords.city !== postCoords.city) {
				return postCoords.city;
			}
			else {
				return PostService.getDistance(postCoords, feedCoords, true) + ' miles away';
			}
		},
		formatTimeForDisplay(time) {
			var currentTime = new Date();

			var difference = currentTime - time;

			var buildString = function(diff, oneUnitInMillis, unitName) {
				var numberOfUnits = Math.floor(diff / oneUnitInMillis);
				if(numberOfUnits > 1) {
					unitName += 's';
				}

				return numberOfUnits + ' ' + unitName + ' ago';
			}

			if(difference / (1000 * 60 * 60 * 60 * 24 * 365) >= 1) {
				return buildString(difference, (1000 * 60 * 60 * 60 * 24 * 365), "year");
			}
			else if(difference / (1000 * 60 * 60 * 60 * 24 * 30) >= 1) {
				// We naively assume each month is 30 days
				return buildString(difference, (1000 * 60 * 60 * 60 * 24 * 30), "month");
			}
			else if(difference / (1000 * 60 * 60 * 60 * 24) >= 1) {
				return buildString(difference, (1000 * 60 * 60 * 60 * 24), "day");
			}
			else if(difference / (1000 * 60 * 60 * 60) >= 1) {
				return buildString(difference, (1000 * 60 * 60 * 60), "hour");
			}
			else if(difference / (1000 * 60 * 60) >= 1) {
				return buildString(difference, (1000 * 60 * 60), "minute");
			}
			else {
				return "less than a minute ago";
			}
		},
		formatPrivacyForDisplay(privacyString) {
			if(privacyString === 'friends') {
				return 'Private';
			}
		},
		render() {
			var dateObject = new Date(this.props.post['post_date']);

			return (
				<div className="feed-post pod">
					<img className="portrait" src="/portrait/test" />
					<div className="post-header">
						<div class="post-header-row">
							<span className="post-author">{ this.props.post['author_name'] }</span>
							<span className="post-private post-info">{ this.formatPrivacyForDisplay(this.props.post['privacy']) }</span>
						</div>
						<div class="post-header-row">
							<span className="post-location post-info">{ this.formatDistanceForDisplay(this.props.post['location'], this.props.location) }</span>
							<span className="post-date post-info">{ this.formatTimeForDisplay(dateObject) }</span>
						</div>
					</div>
					<div className="post-body">
						{ this.props.post['body'] }
					</div>
				</div>
			);
		}
	});

	return Post;
});