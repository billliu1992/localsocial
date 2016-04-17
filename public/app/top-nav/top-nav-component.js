define([
	'top-nav/search-bar/search-bar-component',
	'top-nav/notifications/notifications-component',
	'top-nav/user-summary/user-summary-component',
	'components/user-profile-mixin',
	'react'
], function(
	SearchBar,
	Notifications,
	UserSummaryComponent,
	UserProfileMixin,
	React
) {
	'use strict';

	var TopNav = React.createClass({
		mixins : [UserProfileMixin],
		render() {
			if(this.state.profile !== null) {
				return <div className="top-nav contained">
					<h1><a href=""><strong>Hapnen</strong></a></h1>
					<SearchBar />
					<div className="user-container">
						<UserSummaryComponent profile={this.state.profile} getProfilePic={this.getProfilePic} />
						<Notifications notifications={this.state.profile['notifications']} />
					</div>
				</div>;
			}
			else {
				return <div>Loading</div>;
			}
		}
	});

	return TopNav;
});