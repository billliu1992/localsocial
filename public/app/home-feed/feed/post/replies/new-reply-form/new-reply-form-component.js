define([
	'components/user-profile-mixin',
	'components/post-service',
	'react'
], function(
	UserProfileMixin,
	PostService,
	React
) {
	'use strict';

	var NewReplyForm = React.createClass({
		mixins : [ UserProfileMixin ],
		getInitialState() {
			return {
				body: '',
				expanded : false,
				privacyDropdown : 'public',
				privacyCityName : false
			}
		},
		render() {
			var expandedText = '';
			if(this.state.expanded) {
				expandedText = 'expanded';
			}
			else {
				expandedText = 'unexpanded';
			}

			var privacyClass = '';
			if(this.state.privacyDropdown === 'friends') {
				privacyClass = 'show-friends-options';
			}

			var formClassName = 'new-reply-form ' + expandedText + ' ' + privacyClass;

			return <form className={ formClassName } onSubmit={ this.submitNewReply }>
				<img className="reply-portrait" src={ this.getProfilePic() } />
				<div className="reply-input">
					<textarea onFocus={this.doExpand} placeholder="Speak your mind" value={ this.state.body } onChange={ this.updateReplyBody } />
					<div className="button-row">
						<select className="privacy-dropdown" value={ this.state.privacyDropdown } onChange={ this.updatePrivacyDropdown }>
							<option value="public">Public</option>
							<option value="friends">Friends Only</option>
						</select>
						<span className="privacy-option">
							<input id="privacy-city" type="checkbox" checked={ this.state.privacyCityName } onChange={ this.updatePrivacyCityName } />
							<label htmlFor="privacy-city">Only show city name</label>
						</span>

						<button type="button" onClick={this.doUnexpand} className="cancel">Cancel</button>
						<button className="small">Submit</button>
					</div>
				</div>
			</form>;
		},
		updateReplyBody(event) {
			this.setState({
				body: event.target.value
			});
		},
		updatePrivacyDropdown(event) {
			this.setState({
				privacyDropdown : event.target.value
			});
		},
		updatePrivacyCityName(event) {
			this.setState({
				privacyCityName : event.target.value
			});
		},
		submitNewReply(event) {
			event.preventDefault();

			var privacy = PostService.PRIVACY_SETTINGS.FRIENDS;
			if(this.state.privacyDropdown === 'public') {
				if(this.state.privacyCityName) {
					privacy = PostService.PRIVACY_SETTINGS.HIDE_LOCATION;
				}
				else {
					privacy = PostService.PRIVACY_SETTINGS.PUBLIC;
				}
			}

			PostService.saveReply(this.props.postId, {
				'reply-body' : this.state.body,
				privacy
			}).then((data) => {
				this.props.updatePost(data['updated_post']);
				this.setState({
					body: ''
				});
			});
		},
		doExpand(event) {
			this.setState({
				expanded : true
			});
		},
		doUnexpand(event) {
			this.setState({
				expanded : false,
				body: ''
			});
		}
	});

	return NewReplyForm;
});