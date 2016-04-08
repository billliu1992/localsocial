define([
	'react'
], function(
	React
) {
	'use strict';

	var FriendsList = React.createClass({
		render() {
			var friendsElements = this.props.friends.map((friend) => {
				return <div key={friend['user_id']} onClick={() => this.props.showProfilePopup(friend['user_id'])} className="friend-entry">
					<img className="friend-portrait" src={ friend['portrait_src'] } />
					<div className="friend-name">{ friend['name'] }</div>
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