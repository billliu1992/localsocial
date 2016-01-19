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
			var editElement = null;
			if(!this.state.editing) {
				editElement = <input type='password' value='1234567890' readOnly='true' />;
			}
			else {
				editElement = <div>
					<input type="password" value={this.state.current} onChange={this.updateField('current')} />
					<input type="password" value={this.state.password} onChange={this.updateField('password')} />
					<input type="password" value={this.state.confirm} onChange={this.updateField('confirm')} />
				</div>;
			}

			return <div className='settings-section password'>
				<h2>Change Password</h2>
				<span onClick={this.toggleEditing}>Edit</span>
				{ editElement }
				<button onClick={this.submitPassword}>Submit</button><button>Cancel</button>
			</div>;
		},
		submitPassword() {
			if(this.state.password === this.state.confirm) {
				this.props.updatePassword(this.state.current, this.state.password, this.state.confirm);
			}
		},
		toggleEditing() {
			if(this.state.editing) {
				this.setState({
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