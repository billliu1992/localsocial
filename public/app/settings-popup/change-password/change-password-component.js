define([
	'settings-popup/settings-field/settings-field-component',
	'react'
], function(
	SettingsField,
	React
) {
	var ChangePassword = React.createClass({
		render() {
			return <div className="settings-section password">
				<h2>Change Password</h2>
			</div>;
		}
	});

	return ChangePassword;
});