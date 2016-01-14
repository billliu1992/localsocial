define([
	'components/popup-service',
	'react'
], function(
	PopupService,
	React
) {
	'use strict';

	var FriendsList = React.createClass({
		render() {
			var friendsElements = this.props.friends.map((friend) => {
				var openProfile = function() {
					PopupService.updatePopup({ userId : friend.userId });
				}

				return <div key={friend.userId} onClick={openProfile} className="friend-entry">
					<img className="friend-portrait" src="/portrait/test" />
					<div className="friend-name">{ friend.firstName + ' ' + friend.lastName }</div>
				</div>;
			});

			return <div className="friends profile-info">
				<h2>Friends</h2>
				{ friendsElements }
			</div>;
		}
	});

	return FriendsList;

});