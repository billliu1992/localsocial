define([
	'profile-popup/profile-popup-component',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
	ProfilePopup,
	UserService,
	PopupService,
	React
) {
	'use strict';

	var FriendRequestsPopup = React.createClass({
		render() {
			var requestsPending = this.props.profile['relations']['friend_requests_pending']

			var requestsElement = null;

			if(this.props.profile['relations']['friend_requests_pending'].length !== 0) {
				requestsElement = requestsPending.map((request, index) => {
					return <div key={request['user_id']} className="friend-request-entry">
						<img src={ request['portrait_src'] } />
						<div className="request-name">
							<span className="request-name-text" onClick={this.goToProfile(request['user_id'])}>{ request['name'] }</span>
						</div>
						<div className="button-row">
							<button onClick={this.acceptFriendRequest(request['user_id'], index)}>Accept</button>
							<button onClick={this.declineFriendRequest(request['user_id'], index)} className="delete">Decline</button>
						</div>
					</div>
				});
			}
			else {
				requestsElement = <div className="no-more-requests"><span>(No more pending requests)</span></div>;
			}

			return <div className="friend-requests-popup">
				<div className="friend-requests-header">
					<h2>Friend Requests</h2>
				</div>
				{ requestsElement }
			</div>;
		},
		goToProfile(userId) {
			return () => PopupService.showPopup(ProfilePopup, { userId });
		},
		acceptFriendRequest(userId, index) {
			return () => UserService.sendFriendRequest(userId).then(this.removeEntry(index));
		},
		declineFriendRequest(userId, index) {
			return () => UserService.deleteFriend(userId).then(this.removeEntry(index));
		},
		removeEntry(index) {
			return () => {
				var relations = this.props.profile['relations'];
				relations['friend_requests_pending'].splice(index, 1);

				UserService.overwriteCurrentUserInfo({
					relations
				});

				PopupService.updatePopup({ profile : this.props.profile });
			};
		}
	});

	return FriendRequestsPopup;
});