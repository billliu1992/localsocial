define([
], function(
) {
	'use strict';

	return {
		getInitialState() {
			return {
				message : '',
				messageClass : ''
			}
		},
		setMessage(messageClass, message) {
			this.setState({
				message,
				messageClass
			});
		},
		acknowledgeMessage() {
			this.setMessage('', '');
		},
		getMessageClass() {
			return this.state.messageClass;
		},
		getMessageText() {
			return this.state.message;
		}
	};
});