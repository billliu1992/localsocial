define([
	'index/user-api-service',
	'react'
], function(
	UserAPIService,
	React
) {
	'use strict';

	var LoginFormComponent = React.createClass({
		getInitialState() {
			return {
				email : null,
				password : null
			}
		},
		render() {
			return <form onSubmit={this.doLogin} method="POST">
				<input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.updateEmail} />
				<input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.updatePassword}/>
				<button>Login</button>
			</form>;
		},
		updateEmail(event) {
			this.setState({
				email : event.target.value
			});
		},
		updatePassword(event) {
			this.setState({
				password : event.target.value
			});
		},
		doLogin(event) {
			event.preventDefault();
			UserAPIService.logIn(this.state.email, this.state.password);
		}
	});

	return LoginFormComponent;
});