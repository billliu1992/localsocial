define([
	'components/api-service',
	'axios'
], function(
	APIService,
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
					
					return response.data.success;
				})
		},
		checkLogIn : function() {
			return axios.get('/user/me').then(() => {
				this.handleLoggedIn();
			});
		},
		handleLoggedIn : function() {
			window.location.href = "/web/home";
		}
	}
});