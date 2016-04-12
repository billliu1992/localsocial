define([
	'index/user-api-service',
	'react'
], function(
	UserAPIService,
	React
) {
	'use strict';

	var CreateUserForm = React.createClass({
		getInitialState() {
			return {
				email : null,
				first : null,
				last : null,
				pass : null,
				confirm : null
			};
		},
		render() {
			return <form action="/user/create" method="POST" onSubmit={this.doSubmitUser}>
				<input type="email" name="email" className="email-input" placeholder="Email" 
					onChange={this.createChangeListener('email')} value={this.state.email}
					/>
				<input type="text" name="first-name" className="first-input"placeholder="First"
					onChange={this.createChangeListener('first')} value={this.state.first}
					/>
				<input type="text" name="last-name" className="last-input"placeholder="Last"
					onChange={this.createChangeListener('last')} value={this.state.last}
					/>
				
				<input type="password" name="password" className="pass-input"placeholder="Password"
					onChange={this.createChangeListener('pass')} value={this.state.pass}
					/>
				<input type="password" name="confirm-password" className="c-pass-input"
					placeholder="Confirm Password"
					onChange={this.createChangeListener('confirm')} value={this.state.confirm}
					/>
				<div className="button-row">
					<button className="medium">Submit</button>
				</div>
			</form>
		},
		createChangeListener(stateKey) {
			return (event) => {
				this.setState({
					[stateKey] : event.target.value
				});
			}
		},
		doSubmitUser(event) {
			event.preventDefault();
			
			UserAPIService.createUser({
				email : this.state.email,
				'first-name' : this.state.first,
				'last-name' : this.state.last,
				'password' : this.state.pass,
				'confirm-password' : this.state.confirm
			});
		}
	});

	return CreateUserForm;
});