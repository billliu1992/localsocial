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
		componentWillReceiveProps(nextProps) {
			this.setState({
				editing : typeof nextProps.newValues[this.props.field] !== 'undefined'
			});
		},
		render() {
			var inputElement = null;
			var editingText = null;
			if(this.state.editing) {
				var fieldValue = this.props.oldValues[this.props.field];
				if(typeof this.props.newValues[this.props.field] !== 'undefined') {
					fieldValue = this.props.newValues[this.props.field];
				}

				if(this.props.type === 'text' || this.props.type === 'email') {
					inputElement = <input type={this.props.type} value={fieldValue} onChange={this.onChangeValue} />;
				}
				else if(this.props.type === 'checkbox') {
					inputElement = <input type={this.props.type} checked={fieldValue} onChange={this.onChangeValue} />;
				}
				editingText = 'Cancel';
			}
			else {
				var fieldValue = this.props.oldValues[this.props.field];
				if(fieldValue === true) {
					fieldValue = 'Yes';
				}
				else if(fieldValue === false) {
					fieldValue = 'No';
				}

				inputElement = <div>{ fieldValue }</div>;
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
			else {
				this.updateValue(this.props.oldValues[this.props.field]);
			}
		},
		onChangeValue(event) {
			if(this.props.type === 'checkbox') {
				this.updateValue(event.target.checked);
			}
			else {
				this.updateValue(event.target.checked);
			}
		},
		updateValue(newValue) {
			this.props.updateField(this.props.field, newValue);
		}
	});

	return SettingsField;
});