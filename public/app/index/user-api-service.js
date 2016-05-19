define([
	'components/api-service',
	'config',
	'axios'
], function(
	APIService,
	Config,
	axios
) {
	'use strict';

	return {
		logIn : function(email, password) {
			return axios.post('/user/login', APIService.transformObjectToForm({ email, password }))
				.then((response) => {
					if(response.data.success) {
						this.handleLoggedIn();
					}
					
					return response.data.success;
				})
		},
		createUser : function(user) {
			return axios.post('/user/create', APIService.transformObjectToForm(user))
				.then((response) => {
					if(response.data.success) {
						this.handleLoggedIn();
					}
					
					return response.data;
				})
		},
		checkLogIn : function() {
			return axios.get('/user/me').then(() => {
				this.handleLoggedIn();
			});
		},
		handleLoggedIn : function() {
			window.location.href = Config.WEBAPP_HOME;
		}
	}
});