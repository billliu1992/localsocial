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
				editElement = <div className="change-password"><input className="example-pass" type='password' value='1234567890' readOnly='true' /></div>;
			}
			else {
				editElement = <div className="change-password">
					<input type="password" value={this.state.current} onChange={this.updateField('current')} />
					<input type="password" value={this.state.password} onChange={this.updateField('password')} />
					<input type="password" value={this.state.confirm} onChange={this.updateField('confirm')} />
				</div>;
			}

			return <div className='settings-section password'>
				<h2>Change Password</h2>
				<span onClick={this.toggleEditing}>Edit</span>
				<form onSubmit={this.submitPassword}>
					{ editElement }
					<button>Submit</button><button>Cancel</button>
				</form>
			</div>;
		},
		submitPassword(event) {
			event.preventDefault();

			if(this.state.password === this.state.confirm) {
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