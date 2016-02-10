var myApp = angular.module('myApp');

myApp.controller('LoginController', function($scope, $http, $interval, $state) {
	$scope.user = null;
	
	$scope.login = function(credentials){
		var email = credentials.email;
		var pw = credentials.password;
		$http.post('http://localhost:3000/logInAttempt', {params: {email: email, pw: pw}}).success(function(user){
			$scope.user = user;
		})
	}
});
