define([
	'settings-popup/settings-field/settings-field-component',
	'components/user-service',
	'react'
], function(
	SettingsField,
	UserService,
	React
) {
	var PersonalInfo = React.createClass({
		getInitialState() {
			return {
				data : {}
			};
		},
		render() {
			return <div className="settings-section personal">
				<h2>Personal info</h2>
				<SettingsField field="email" label="Email" type="email" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
				<SettingsField field="phone" label="Phone" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
				<SettingsField field="first_name" label="First name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
				<SettingsField field="last_name" label="Last name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
				<SettingsField field="nick_name" label="Nick name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
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
			delete this.state.data[field];
		},
		submitData() {
			console.log(this.state.data);
		}
	});

	return PersonalInfo;
});