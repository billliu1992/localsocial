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
				<form onSubmit={this.submitData}>
					<SettingsField field="email" label="Email" type="email" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} required={true} />
					<SettingsField field="phone" label="Phone" type="telephone" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} required={true} />
					<SettingsField field="first_name" label="First name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} required={true} />
					<SettingsField field="last_name" label="Last name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} required={true} />
					<SettingsField field="nick_name" label="Nick name" type="text" oldValues={this.props.data} newValues={this.state.data} updateField={this.updateField} cancelUpdate={this.cancelUpdate} />
					<button>Submit</button>
					<button className="cancel" type="button" onClick={this.props.cancelSettings}>Cancel</button>
				</form>
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
			event.preventDefault();

			if(event.target.checkValidity()) {
				this.props.updateInfo(this.state.data);

				this.setState({
					data : {}
				});
			}
			else {
			}
		}
	});

	return PersonalInfo;
});