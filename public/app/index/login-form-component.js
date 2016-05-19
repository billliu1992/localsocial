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

	var LoginFormComponent = React.createClass({
		mixins : [ MessageEnabledMixin ],
		getInitialState() {
			return {
				email : null,
				password : null,
				loading : false
			}
		},
		render() {
			var formClass = '';
			if(this.state.loading) {
				formClass = 'is-loading';
			}

			return <form onSubmit={this.doLogin} className={formClass} method="POST">
				<input type="email" name="email" placeholder="Email" required
					value={this.state.email} onChange={this.updateEmail} />
				<input type="password" name="password" placeholder="Password" required
					value={this.state.password} onChange={this.updatePassword} />
				<button>Login</button>

				<div className={ 'login-message ' + this.getMessageClass() }>
					{ this.getMessageText() }
				</div>

				<div className="loading"></div> 
			</form>;
		},
		updateEmail(event) {
			this.setState({
				email : event.target.value
			});

			this.acknowledgeMessage();
		},
		updatePassword(event) {
			this.setState({
				password : event.target.value
			});

			this.acknowledgeMessage();
		},
		doLogin(event) {
			event.preventDefault();
			this.setState({
				loading : true
			});

			UserAPIService.logIn(this.state.email, this.state.password).then((result) => {
				if(result === false) {
					this.setMessage('error', 'User name/password incorrect');

					this.setState({
						loading : false
					});
				}
			});

			this.acknowledgeMessage();
		}
	});

	return LoginFormComponent;
});
