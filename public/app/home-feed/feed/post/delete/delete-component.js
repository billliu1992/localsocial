define([
	'components/user-service',
	'react'
], function(
	UserService,
	React
) {
	'use strict';

	var Delete = React.createClass({
		getInitialState() {
			return {
				confirm : false,
				isAuthor : false,
			};
		},
		componentWillMount() {
			UserService.getCurrentUserInfo().then((user) => {
				if(user['user_id'] === this.props.authorId) {
					this.setState({
						isAuthor : true
					});
				}
			});
		},
		render() {
			if(!this.state.isAuthor) {
				return null;
			}
			else if(this.state.confirm === false) {
				return <span className={ this.props.className + ' post-delete' } onClick={this.doConfirm}>
					{ this.props.children }
				</span>
			}
			else {
				return <span className={ 'post-delete confirming' }>
					<span className="confirm-text">Are you sure?</span>
					<a className="delete-option confirm" onClick={this.doCallback}>Yes</a>
					<a className="delete-option cancel" onClick={this.doCancel}>No</a>
				</span>
			}
		},
		doConfirm() {
			this.setState({
				confirm : true
			});
		},
		doCallback() {
			if(this.props.onConfirm) {
				this.props.onConfirm();
			}
		},
		doCancel() {
			this.setState({
				confirm : false
			});
		}
	});

	return Delete;
});