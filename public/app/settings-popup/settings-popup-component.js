define([
	'settings-popup/change-password/change-password-component',
	'settings-popup/personal-info/personal-info-component',
	'settings-popup/privacy-settings/privacy-settings-component',
	'components/message-enabled-mixin',
	'components/user-service',
	'components/popup-service',
	'react'
], function(
	ChangePassword,
	PersonalInfo,
	PrivacySettings,
	MessageEnabledMixin,
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
		mixins : [ MessageEnabledMixin ],
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
		updatePassword(current, password, confirm) {
			if(password !== confirm) {
				this.setMessage('error', 'New password does not match your confirm password');
			}
			return UserService.updateCredentials(current, password, confirm).then((response) => {
				if(!response.success) {
					if(response.reason === 'authentication') {
						this.setMessage('error', 'Your current password is not correct');
					}
				}
				else {
					this.setMessage('success', 'Password changed');
				}
			});
		},
		updateUserInfo(newInfo) {
			return UserService.updateCurrentUserInfo(newInfo).then((result) => {
				this.setState({
					user : result.user
				});

				this.setMessage('success', 'Updated');
			}, () => {
				this.setMessage('error', 'An error has occurred');
			});
		},
		changeSettingsTab(tab) {
			return () => {
				this.acknowledgeMessage();
				this.setState({ tab });
			};
		},
		closeSettingsPopup() {
			PopupService.destroyPopup();
		}
	});

	return SettingsPopup;
});