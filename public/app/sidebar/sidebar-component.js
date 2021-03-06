define([
	'friend-requests-popup/friend-requests-popup-component',
	'upload-pic-popup/upload-pic-popup-component',
	'profile-popup/profile-popup-component',
	'settings-popup/settings-popup-component',
	'copyright-text/copyright-text-component',
	'components/popup-service',
	'components/user-service',
	'components/user-profile-mixin',
	'react'
], function(
	FriendRequestsPopup,
	UploadPicPopup,
	ProfilePopup,
	SettingsPopup,
	CopyrightText,
	PopupService,
	UserService,
	UserProfileMixin,
	React
) {
	'use strict';

	var Sidebar = React.createClass({
		mixins : [UserProfileMixin],
		render() {
			var requestsPopup = null;
			if(this.state.profile !== null 
					&& this.state.profile['relations'] 
					&& this.state.profile['relations']['friend_requests_pending']
					&& this.state.profile['relations']['friend_requests_pending'].length > 0
			) {
				requestsPopup = <div className="sidebar-option important" onClick={ this.showFriendRequests }>
					Friend Requests ({this.state.profile['relations']['friend_requests_pending'].length})
				</div>;
			}

			return <div className="sidebar-content">
				<div className="main-portrait-wrap">
					<img className="main-portrait" src={ this.getProfilePic() } />
				</div>
				<div className="sidebar-options">
					{ requestsPopup }
					<div className="sidebar-option" onClick={this.showUploadPopup}>Change your picture</div>
					<div className="sidebar-option" onClick={this.showProfilePopup}>Profile</div>
					<div className="sidebar-option" onClick={this.showSettingsPopup}>Settings</div>
				</div>
				<CopyrightText />
			</div>;
		},
		showFriendRequests() {
			PopupService.showPopup(FriendRequestsPopup, { profile: this.state.profile });
		},
		showUploadPopup() {
			PopupService.showPopup(UploadPicPopup);
		},
		showProfilePopup() {
			PopupService.showPopup(ProfilePopup, { userId : 'me' });
		},
		showSettingsPopup() {
			PopupService.showPopup(SettingsPopup, { userId : 'me' });
		}
	});

	return Sidebar;
});