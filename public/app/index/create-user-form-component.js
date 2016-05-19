define([
	'index/user-api-service',
	'components/message-enabled-mixin',
	'react'
], function(
	UserAPIService,
	MessageEnabledMixin,
	React
) {
	'use strict';

	var CreateUserForm = React.createClass({
		mixins : [ MessageEnabledMixin ],
		getInitialState() {
			return {
				email : '',
				first : '',
				last : '',
				pass : '',
				confirm : '',
				loading : false
			};
		},
		render() {
			var formClass = '';
			if(this.state.loading === true) {
				formClass = 'is-loading';
			}

			return <form action="/user/create" className={formClass} method="POST" onSubmit={this.doSubmitUser}>
				<input type="email" name="email" className="email-input" placeholder="Email" required
					onChange={this.createChangeListener('email')} value={this.state.email}
					/>
				<input type="text" name="first-name" className="first-input" placeholder="First" required
					onChange={this.createChangeListener('first')} value={this.state.first}
					/>
				<input type="text" name="last-name" className="last-input" placeholder="Last" required
					onChange={this.createChangeListener('last')} value={this.state.last}
					/>
				
				<input type="password" name="password" className="pass-input" placeholder="Password" required
					onChange={this.createChangeListener('pass')} value={this.state.pass}
					/>
				<input type="password" name="confirm-password" className="c-pass-input"
					placeholder="Confirm Password" required
					onChange={this.createChangeListener('confirm')} value={this.state.confirm}
					/>

				<div className={ 'create-user-message ' + this.getMessageClass() }>
					{ this.getMessageText() }
				</div>

				<div className="button-row">
					<button className="medium">Submit</button>
				</div>

				<div className="loading"></div>
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
			this.setState({
				loading : true
			});
			
			UserAPIService.createUser({
				email : this.state.email,
				'first-name' : this.state.first,
				'last-name' : this.state.last,
				'password' : this.state.pass,
				'confirm-password' : this.state.confirm
			}).then((data) => {
				if(data.success === false) {
					this.setMessage('error', data.message);

					this.setState({
						loading : false
					});
				}
			});
		}
	});

	return CreateUserForm;
});