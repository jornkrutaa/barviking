var myApp = angular.module('myApp');

myApp.controller('LoginController', function($scope,$rootScope, $http, $interval, $state, $window, AuthService, AUTH_EVENTS) {
	//$scope.user = null;
		
	$scope.login = function(credentials){
		AuthService.login(credentials).then(function(user){
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
			
			var userdata = {
				user_id: user.data.user_id,
				username: user.data.username,
				first_name: user.data.first_name,
				last_name: user.data.last_name,
				status_id: user.data.status_id,
				account_type: user.data.account_type,
			}
			
			$window.localStorage.token = user.data.body.token;
			$window.localStorage.user = JSON.stringify(userdata);
			
			$scope.setUser(user);
		}, function(){
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
		});
	}
});