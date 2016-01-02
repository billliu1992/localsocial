define([
	'top-nav/search-bar/search-bar-component',
	'top-nav/user-summary/user-summary-component',
	'react'
], function(
	SearchBar,
	UserSummaryComponent,
	React
) {
	'use strict';

	var TopNav = React.createClass({
		render() {
			return <div className="top-nav contained">
				<strong>LocalSocial</strong>
				<SearchBar />
				<UserSummaryComponent />
			</div>
		}
	});

	return TopNav;
});