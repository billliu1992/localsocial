define([
	'settings-popup/settings-field/settings-field-component',
	'components/location-service',
	'react'
], function(
	SettingsField,
	React
) {
	var PrivacySettings = React.createClass({
		getInitialState() {
			return {
				data : {}
			};
		},
		render() {
			return <div className="settings-section privacy">
				<SettingsField field="show_last_name" label="Show last name" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<SettingsField field="name_search" label="Searchable by name" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<SettingsField field="browser_geo" label="Use browser geolocation" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<button onClick={this.submitData}>Submit</button>
				<button className="cancel" type="button" onClick={this.props.cancelSettings}>Cancel</button>
			</div>;
		},
		updateField(field, value) {
			var newData = this.state.data;
			newData[field] = value;
			this.setState({
				data : newData
			});
		},
		cancelUpdate(field) {
			var newData = this.state.data;
			delete newData[field];
			this.setState({
				data : newData
			});
		},
		submitData(event) {
			if(event.target.checkValidity()) {
				this.setState({
					data : {}
				});
				this.props.updateInfo(this.state.data);

				if(this.state.data['browser_geo']) {
					LocationService.useBrowserGeolocation = true;
					LocationService.doBrowserGeolocation();	// Force update of browser
				}
			}
			else {
			}
		}
	});

	return PrivacySettings;
});