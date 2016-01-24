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
					inputElement = <input type={this.props.type} value={fieldValue} id={this.props.field} onChange={this.onChangeValue} required={this.props.required} />;
				}
				else if(this.props.type === 'checkbox') {
					inputElement = <input type={this.props.type} checked={fieldValue} id={this.props.field} onChange={this.onChangeValue} required={this.props.required} />;
				}
				else if(this.props.type === 'telephone') {
					inputElement = <input type='text' value={fieldValue} id={this.props.field} onChange={this.onChangeValue} required={this.props.required} pattern="[0-9-()]+" />;
				}
				editingText = 'Cancel';
			}
			else {
				var fieldValue = this.props.oldValues[this.props.field];

				if(typeof fieldValue === 'undefined' || fieldValue === '' || fieldValue === null) {
					inputElement = <div className="current-value empty">Empty</div>;
				}
				else {
					if(fieldValue === true) {
						fieldValue = 'Yes';
					}
					else if(fieldValue === false) {
						fieldValue = 'No';
					}

					inputElement = <div className="current-value">{ fieldValue }</div>;
				}
				editingText = 'Edit';
			}

			return <fieldset className="settings-field">
				<label htmlFor={this.props.field}>{this.props.label}</label>
				<a onClick={this.toggleMode}>{ editingText }</a>
				<div className="value-wrapper">
					{inputElement}
				</div>
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
				this.updateValue(event.target.value);
			}
		},
		updateValue(newValue) {
			this.props.updateField(this.props.field, newValue);
		}
	});

	return SettingsField;
});