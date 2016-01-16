define([
	'react'
], function(
	React
) {
	var SettingsField = React.createClass({
		getInitialState() {
			return {
				editing : false
			}
		},
		render() {
			var inputElement = null;
			var editingText = null;
			if(this.state.editing) {
				inputElement = <input type={this.props.type} value={this.props.user[this.props.field]} onChange={this.changeValue} />;
				editingText = 'Cancel';
			}
			else {
				inputElement = <div>{this.props.value}</div>;
				editingText = 'Edit';
			}

			return <fieldset>
				<label>{this.props.label}</label>
				{inputElement}
				<a onClick={this.toggleMode}>{ editingText }</a>
			</fieldset>;
		},
		toggleMode() {
			this.setState({
				editing : !this.state.editing
			});
		},
		changeValue(event) {
			this.props.updateProfileField(this.props.field, event.target.value);
		}
	});

	return SettingsField;
});