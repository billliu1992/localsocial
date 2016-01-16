define([
	'settings-popup/settings-field/settings-field-component',
	'components/user-service',
	'react'
], function(
	SettingsField,
	UserService,
	React
) {
	'use strict';

	var SettingsPopup = React.createClass({
		getInitialState() {
			return { user : null };
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
				return <div class="edit-profile">
					<SettingsField field="email" label="Email" type="email" user={this.state.user} updateProfileField={this.updateProfileField} />
					<SettingsField field="phone" label="Phone" type="text" user={this.state.user} updateProfileField={this.updateProfileField} />
					

					<SettingsField field="first-name" label="First name" type="text" user={this.state.user} updateProfileField={this.updateProfileField} />
					
					<SettingsField field="last-name" label="Last name" type="text" user={this.state.user} updateProfileField={this.updateProfileField} />
					
					<SettingsField field="nick-name" label="Nick name" type="text" user={this.state.user} updateProfileField={this.updateProfileField} />

					<SettingsField field="show-last-name" label="Show last name" type="checkbox" user={this.state.user} updateProfileField={this.updateProfileField} />
					
					<SettingsField field="exact-location" label="Show coordinates" type="checkbox" user={this.state.user} updateProfileField={this.updateProfileField} />
					
					<SettingsField field="name-search" label="Searchable by name" type="checkbox" user={this.state.user} updateProfileField={this.updateProfileField} />
					
					<SettingsField field="browser-geo" label="Use browser geolocation" type="checkbox" user={this.state.user} updateProfileField={this.updateProfileField} />
				
					<button>Save</button><button>Cancel</button>
				</div>
			}

		},
		updateProfileField(fieldName, fieldValue) {
			this.state.user[fieldName] = fieldValue;
		},
		saveProfileField() {
		}
	});

	return SettingsPopup;
});