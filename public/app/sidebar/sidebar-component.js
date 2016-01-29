define([
	'upload-pic-popup/upload-pic-popup-component',
	'profile-popup/profile-popup-component',
	'settings-popup/settings-popup-component',
	'components/popup-service',
	'react'
], function(
	UploadPicPopup,
	ProfilePopup,
	SettingsPopup,
	PopupService,
	React
) {
	'use strict';

	var Sidebar = React.createClass({
		render() {
			return <div className="sidebar-content">
				<img className="main-portrait" src="/portrait/test" />
				<div className="sidebar-options">
					<div className="sidebar-option" onClick={this.showUploadPopup}>Change your picture</div>
					<div className="sidebar-option" onClick={this.showProfilePopup}>Profile</div>
					<div className="sidebar-option" onClick={this.showSettingsPopup}>Settings</div>
				</div>
				<div className="legal-misc">
					&copy; 2015 Bill Liu
				</div>
			</div>;
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