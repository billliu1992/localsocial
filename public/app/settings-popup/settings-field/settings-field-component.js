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
				var textValue = this.props.oldValues[this.props.field];
				if(typeof this.props.newValues[this.props.field] !== 'undefined') {
					textValue = this.props.newValues[this.props.field];
				}

				inputElement = <input type={this.props.type} value={textValue} onChange={this.changeValue} />;
				editingText = 'Cancel';
			}
			else {
				inputElement = <div>{this.props.oldValues[this.props.field]}</div>;
				editingText = 'Edit';
			}

			return <fieldset>
				<label>{this.props.label}</label>
				{inputElement}
				<a onClick={this.toggleMode}>{ editingText }</a>
			</fieldset>;
		},
		toggleMode() {
			if(this.state.editing) {
				this.props.cancelUpdate(this.props.field);
			}

			this.setState({
				editing : !this.state.editing
			});
		},
		changeValue(event) {
			this.props.updateField(this.props.field, event.target.value);
		}
	});

	return SettingsField;
});