define([
	'components/post-service',
	'react'
], function(
	PostService,
	React
) {
	'use strict';

	var NewReplyForm = React.createClass({
		getInitialState() {
			return {
				body: ''
			}
		},
		render() {
			return (
				<form onSubmit={ this.submitNewReply }>
					<textarea value={ this.state.body } onChange={ this.updateReplyBody } />
					<button>Submit</button>
				</form>
			)
		},

		updateReplyBody(event) {
			this.setState({
				body: event.target.value
			});
		},

		submitNewReply(event) {
			event.preventDefault();

			PostService.saveReply(this.props.postId, {
				'reply-body' : this.state.body
			}).then((data) => {
				this.props.updatePost(data['updated_post']);
				this.setState({
					body: ''
				});
			});
		}
	});

	return NewReplyForm;
});