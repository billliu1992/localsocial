define([
	'settings-popup/settings-field/settings-field-component',
	'react'
], function(
	SettingsField,
	React
) {
	var PrivacySettings = React.createClass({
		render() {
			return <div className="settings-section privacy">
				<h2>Privacy</h2>
				<SettingsField field="show_last_name" label="Show last name" type="checkbox" data={this.props.data} updateProfileField={this.updateProfileField} />
				<SettingsField field="exact_location" label="Show coordinates" type="checkbox" data={this.props.data} updateProfileField={this.updateProfileField} />
				<SettingsField field="name_search" label="Searchable by name" type="checkbox" data={this.props.data} updateProfileField={this.updateProfileField} />
				<SettingsField field="browser_geo" label="Use browser geolocation" type="checkbox" data={this.props.data} updateProfileField={this.updateProfileField} />
				<button>Save</button><button>Cancel</button>
			</div>;
		}
	});

	return PrivacySettings;
});