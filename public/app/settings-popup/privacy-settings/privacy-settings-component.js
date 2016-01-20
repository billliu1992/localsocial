define([
	'settings-popup/settings-field/settings-field-component',
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
				<h2>Privacy</h2>
				<SettingsField field="show_last_name" label="Show last name" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<SettingsField field="name_search" label="Searchable by name" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<SettingsField field="browser_geo" label="Use browser geolocation" type="checkbox" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate}  />
				<button onClick={this.submitData}>Submit</button><button>Cancel</button>
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
			console.log(event.target.checkValidity());
			if(event.target.checkValidity()) {
				this.setState({
					data : {}
				});
				this.props.updateInfo(this.state.data);
			}
			else {
			}
		}
	});

	return PrivacySettings;
});