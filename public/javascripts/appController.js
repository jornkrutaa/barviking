var myApp = angular.module('myApp');

myApp.controller('AppController', function($window, $scope, $http, $interval, $state, AuthService, AUTH_EVENTS) {
	$scope.setUser = function(user){
		$scope.user = user.data;
	};
	(function(){
		var user = AuthService.fillAuthData();
		if(user){
			$scope.user = user;
		}
	})();
	
})
.factory('AuthService', function($http, $window){
	var authService = {};
	
	authService.login = function(credentials){
		var email = credentials.email;
		var pw = credentials.password;
		return $http.post('http://localhost:3000/logInAttempt', {params: {email: email, pw: pw}}).success(function(user){			
			return user;
		})
	};
	
	authService.fillAuthData = function(){
		var authData = $window.localStorage.user;
		if(authData){
			return JSON.parse(authData);
		}
	};
	return authService;
})
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  owner: 'owner',
  member: 'member',
  guest: 'guest'
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push([
    '$injector',
    function ($injector) {
      return $injector.get('AuthInterceptor');
    }
  ]);
})
.factory('AuthInterceptor', function ($rootScope, $window, $q,
                                      AUTH_EVENTS) {
										  console.log("interceptor");
										  console.log($window.localStorage.token);
	var authInterceptorServiceFactory = {};									  
	var _request = function(config){
		console.log("config");
		console.log(config);
		config.headers = config.headers || {};
		if($window.localStorage.token){
			config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
		}
		return config;
	}
	var _responseError = function (response) {
		$rootScope.$broadcast({
			401: AUTH_EVENTS.notAuthenticated,
			403: AUTH_EVENTS.notAuthorized,
			419: AUTH_EVENTS.sessionTimeout,
			440: AUTH_EVENTS.sessionTimeout
		}[response.status], response);
		//Sahil
		if(response.status = 401){
			$(location.path("/login"));
		}
		return $q.reject(response);
	}
	authInterceptorServiceFactory.request = _request;
	authInterceptorServiceFactory.responseError = _responseError;
	return authInterceptorServiceFactory;
});
