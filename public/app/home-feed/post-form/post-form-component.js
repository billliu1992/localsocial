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
			return (
				<form id="post-form" className="pod" onSubmit={this.submitNewPost }>
					<fieldset className="post-body">
						<div className="post-author-info">
							Portrait
						</div>
						
						<textarea value={this.state.postBody} onChange={ this.updatePostBody } placeholder="Say something">
						</textarea>
					</fieldset>
					<fieldset className="post-privacy-settings">
						<select value={this.state.privacyDropdown} onChange={ this.updatePrivacyDropdown }>
							<option value="public">Public</option>
							<option value="friends">Friends Only</option>
						</select>

						Only show last initial { this.state.privacyLastName } 
						<input type="checkbox" checked={ this.state.privacyLastName } onChange={ this.updatePrivacyLastName } />

						Only show city name
						<input type="checkbox" checked={ this.state.privacyCityName } onChange={ this.updatePrivacyCityName } />
					</fieldset>
					<fieldset className="post-buttons">
						<button>Cancel</button>
						<button>Submit</button>
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