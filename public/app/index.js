requirejs.config({
	baseUrl: '/web/',
	paths : {
		'axios' : 'bower_components/axios/dist/axios',
		'react' : 'bower_components/react/react',
		'react-dom' : 'bower_components/react/react-dom',
		'babel-polyfill' : 'bower_components/babel-polyfill/browser-polyfill'
	}
});

requirejs([
	'index/login-form-component',
	'index/create-user-form-component',
	'index/user-api-service',
	'react',
	'react-dom'
], function(
	LoginForm,
	CreateUserForm,
	UserAPIService,
	React,
	ReactDOM
) {
	UserAPIService.checkLogIn();

	ReactDOM.render(
		<LoginForm />,
		document.getElementById('login-form-container')
	);

	ReactDOM.render(
		<CreateUserForm />,
		document.getElementById('create-account')
	);
});