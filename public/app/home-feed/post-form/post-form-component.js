define(['react'], function(React) {
	'use strict';

	var NewPostForm = React.createClass({
		getInitialState() {
			return {
				postBody : '',
				privacyDropdown : 'public',
				privacyLastName : false,
				privacyCityName : false
			}
		},
		render() {
			var privacyClassName = "post-privacy-settings";

			if(this.state.privacyDropdown === 'public')
				privacyClassName += " is-public";

			return (
				<form id="post-form" className="pod important" onSubmit={this.submitNewPost }>
					<fieldset className="post-body">
						<img className="post-author-info portrait large" src="/portrait/test" />
						
						<textarea value={this.state.postBody} onChange={ this.updatePostBody } placeholder="Say something">
						</textarea>
					</fieldset>
					<fieldset className={ privacyClassName }>
						<select value={this.state.privacyDropdown} onChange={ this.updatePrivacyDropdown }>
							<option value="public">Public</option>
							<option value="friends">Friends Only</option>
						</select>

						<span className="privacy-option">
							<input id="privacy-city" type="checkbox" checked={ this.state.privacyCityName } onChange={ this.updatePrivacyCityName } />
							<label htmlFor="privacy-city">Only show city name</label>
						</span>
					</fieldset>
					<fieldset className="post-buttons">
						<button className="medium">Submit</button>
					</fieldset>
				</form>
			);
		},

		submitNewPost(event) {
			event.preventDefault();
			
			var privacy = "";

			if(this.state.privacyDropdown === 'public') {
				if(this.state.privacyLastName && this.state.privacyCityName) {
					privacy = 'hide_both';
				}
				else if(this.state.privacyLastName) {
					privacy = 'hide_last_name';
				}
				else if(this.state.privacyCityName) {
					privacy = 'hide_location';
				}
				else {
					privacy = 'public';
				}
			}
			else if(this.state.privacyDropdown === 'friends') {
				privacy = 'friends';
			}

			this.props.onSubmit({
				['post-body'] : this.state.postBody,
				privacy
			});

			this.setState({
				postBody : '',
				privacyDropdown : 'public',
				privacyLastName : false,
				privacyCityName : false
			});
		},
		updatePostBody(event) {
			this.setState({
				postBody : event.target.value
			});
		},
		updatePrivacyDropdown(event) {
			this.setState({ privacyDropdown : event.target.value });
		},
		updatePrivacyLastName(event) {
			this.setState({ privacyLastName : event.target.checked });
		},
		updatePrivacyCityName(event) {
			this.setState({ privacyCityName : event.target.checked });
		}
	});

	return NewPostForm;
});