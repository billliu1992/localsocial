define([
	'settings-popup/change-password/change-password-component',
	'settings-popup/personal-info/personal-info-component',
	'settings-popup/privacy-settings/privacy-settings-component',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
	ChangePassword,
	PersonalInfo,
	PrivacySettings,
	UserService,
	PopupService,
	React
) {
	'use strict';

	var SettingsTabs = {
		PERSONAL : 'personal',
		PRIVACY : 'privacy',
		PASSWORD : 'password'
	}

	var SettingsPopup = React.createClass({
		getInitialState() {
			return { 
				user : null,
				tab : 'personal'
			};
		},
		componentWillMount() {
			UserService.getCurrentUserInfo().then((user) => {
				this.setState({
					user
				});
			});
		},
		render() {
			if(this.state.user === null) {
				return <div>Loading</div>;
			}
			else {
				return <div className={"edit-user-settings " + this.state.tab}>
					<h1>Settings</h1>
					<div className="settings-tab-selector">
						<span onClick={this.changeSettingsTab(SettingsTabs.PERSONAL)}>Personal Info</span>
						<span onClick={this.changeSettingsTab(SettingsTabs.PRIVACY)}>Privacy</span>
						<span onClick={this.changeSettingsTab(SettingsTabs.PASSWORD)}>Password</span>
					</div>
					{/*<ChangePassword data={this.state.user} updateInfo={this.updateUserInfo} />*/}
					<PersonalInfo data={this.state.user} updateInfo={this.updateUserInfo}/>
					{/*<PrivacySettings data={this.state.user.preferences} updateInfo={this.updateUserInfo}/>*/}
				</div>;
			}
		},
		updatePassword() {
		},
		updateUserInfo(newInfo) {
			UserService.updateCurrentUserInfo(newInfo).then((result) => {
				this.setState({
					user : result.user
				});
			});
		},
		changeSettingsTab(tab) {
			return () => {
				this.setState({ tab });
			};
		},
		closeSettingsPopup() {
			PopupService.destroyPopup();
		}
	});

	return SettingsPopup;
});