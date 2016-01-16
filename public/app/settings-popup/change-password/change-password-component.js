define([
	'settings-popup/settings-field/settings-field-component',
	'react'
], function(
	SettingsField,
	React
) {
	var ChangePassword = React.createClass({
		getInitialState() {
			return {
				editing : false,
				password : '',
				confirm : ''
			};
		},
		render() {
			var editText = null;
			var editElement = null;
			if(!this.state.editing) {
				editElement = <div className="change-password">
					<fieldset className="settings-field">
						<label htmlFor="current">Password:</label>
						<div className="value-wrapper">
							<input className="example-pass" type='password' value='1234567890' readOnly='true' />
						</div>
					</fieldset>
				</div>;

				editText = 'Change password';
			}
			else {
				editElement = <div className="change-password">
					<fieldset className="settings-field">
						<label htmlFor="current">Current password:</label>
						<div className="value-wrapper">
							<input type="password" value={this.state.current} onChange={this.updateField('current')} />
						</div>
					</fieldset>

					<fieldset className="settings-field">
						<label htmlFor="current">New password:</label>
						<div className="value-wrapper">
							<input type="password" value={this.state.password} onChange={this.updateField('password')} />
						</div>
					</fieldset>

					<fieldset className="settings-field">
						<label htmlFor="current">Confirm new password:</label>
						<div className="value-wrapper">
							<input type="password" value={this.state.confirm} onChange={this.updateField('confirm')} />
						</div>
					</fieldset>
				</div>;

				editText = 'Cancel change';
			}

			return <div className='settings-section password'>
				<span className="toggle-edit" onClick={this.toggleEditing}>{ editText }</span>
				<form onSubmit={this.submitPassword}>
					{ editElement }
					<button>Submit</button>
					<button className="cancel" type="button" onClick={this.props.cancelSettings}>Cancel</button>
				</form>
			</div>;
		},
		submitPassword(event) {
			event.preventDefault();

			if(this.state.editing) {
				this.props.updatePassword(this.state.current, this.state.password, this.state.confirm).then((data) => {
					if(data.success) {
						this.toggleEditing();
					}
				});
			}
		},
		toggleEditing() {
			if(this.state.editing) {
				this.setState({
					'current' : '',
					'password' : '',
					'confirm' : ''
				});
			}
			this.setState({
				editing : !this.state.editing
			});
		},
		updateField(fieldName) {
			return (event) => {
				this.setState({
					[fieldName] : event.target.value
				});
			};
		}
	});

	return ChangePassword;
});