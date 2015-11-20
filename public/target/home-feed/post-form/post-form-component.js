'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

define(['react'], function (React) {
	'use strict';

	var NewPostForm = React.createClass({
		displayName: 'NewPostForm',
		getInitialState: function getInitialState() {
			return {
				postBody: '',
				privacyDropdown: 'public',
				privacyLastName: false,
				privacyCityName: false
			};
		},
		render: function render() {
			return React.createElement(
				'form',
				{ onSubmit: this.submitNewPost },
				React.createElement(
					'fieldset',
					null,
					React.createElement('textarea', { value: this.state.postBody, onChange: this.updatePostBody })
				),
				React.createElement(
					'fieldset',
					null,
					React.createElement(
						'select',
						{ value: this.state.privacyDropdown, onChange: this.updatePrivacyDropdown },
						React.createElement(
							'option',
							{ value: 'public' },
							'Public'
						),
						React.createElement(
							'option',
							{ value: 'friends' },
							'Friends Only'
						)
					),
					'Only show last initial ',
					this.state.privacyLastName,
					React.createElement('input', { type: 'checkbox', checked: this.state.privacyLastName, onChange: this.updatePrivacyLastName }),
					'Only show city name',
					React.createElement('input', { type: 'checkbox', checked: this.state.privacyCityName, onChange: this.updatePrivacyCityName })
				),
				React.createElement(
					'fieldset',
					null,
					React.createElement(
						'button',
						null,
						'Submit'
					)
				)
			);
		},
		submitNewPost: function submitNewPost(event) {
			var _props$onSubmit;

			event.preventDefault();

			var privacy = "";

			if (this.state.privacyDropdown === 'public') {
				if (this.state.privacyLastName && this.state.privacyCityName) {
					privacy = 'hide_both';
				} else if (this.state.privacyLastName) {
					privacy = 'hide_last_name';
				} else if (this.state.privacyCityName) {
					privacy = 'hide_location';
				} else {
					privacy = 'public';
				}
			} else if (this.state.privacyDropdown === 'friends') {
				privacy = 'friends';
			}

			this.props.onSubmit((_props$onSubmit = {}, _defineProperty(_props$onSubmit, 'post-body', this.state.postBody), _defineProperty(_props$onSubmit, 'privacy', privacy), _props$onSubmit));

			this.setState({
				postBody: '',
				privacyDropdown: 'public',
				privacyLastName: false,
				privacyCityName: false
			});
		},
		updatePostBody: function updatePostBody(event) {
			this.setState({
				postBody: event.target.value
			});
		},
		updatePrivacyDropdown: function updatePrivacyDropdown(event) {
			this.setState({ privacyDropdown: event.target.value });
		},
		updatePrivacyLastName: function updatePrivacyLastName(event) {
			this.setState({ privacyLastName: event.target.checked });
		},
		updatePrivacyCityName: function updatePrivacyCityName(event) {
			this.setState({ privacyCityName: event.target.checked });
		}
	});

	return NewPostForm;
});