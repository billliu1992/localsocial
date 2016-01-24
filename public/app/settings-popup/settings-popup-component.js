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
				tab : 'personal',
				message : '',
				messageClass : ''
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
				return <div className={"edit-user-settings pod " + this.state.tab}>
					<h2>Settings</h2>
					<div className="settings-tab-selector">
						<span className='personal' onClick={this.changeSettingsTab(SettingsTabs.PERSONAL)}>Personal Info</span>
						<span className='privacy' onClick={this.changeSettingsTab(SettingsTabs.PRIVACY)}>Privacy</span>
						<span className='password' onClick={this.changeSettingsTab(SettingsTabs.PASSWORD)}>Password</span>
					</div>
					<div className={ 'settings-message ' + this.state.messageClass }>
						{ this.state.message }
					</div>
					<ChangePassword data={this.state.user} updatePassword={this.updatePassword}
						cancelSettings={this.closeSettingsPopup} />
					<PersonalInfo data={this.state.user} updateInfo={this.updateUserInfo}
						cancelSettings={this.closeSettingsPopup} />
					<PrivacySettings data={this.state.user.preferences} updateInfo={this.updateUserInfo}
						cancelSettings={this.closeSettingsPopup} />
				</div>;
			}
		},
		setMessage(messageClass, message) {
			this.setState({
				message,
				messageClass
			});
		},
		acknowledgeMessage() {
			this.setMessage('', '');
		},
		updatePassword(current, password, confirm) {
			return UserService.updateCredentials(current, password, confirm);
		},
		updateUserInfo(newInfo) {
			return UserService.updateCurrentUserInfo(newInfo).then((result) => {
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