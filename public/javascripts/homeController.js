var myApp = angular.module('myApp');

myApp.controller('HomeController', function($scope, $http, $interval, $state, AuthService) {
	loadData();
	// setUserData();
	
	// $interval(function () {
	// 	loadData();
	// }, 300);
	function loadData(){
		$http.get('http://localhost:3000/getAllBars').success(function(data){
			$scope.bars = data;
			$scope.topRatedBars = sortByRating(data);
			console.log($scope.topRatedBars);
		});
	};
	
	// function setUserData(){
	// 	var user = AuthService.fillAuthData();
	// 	if(user){
	// 		//FORTSETT HER: USER HENTES, NÅ MÅ HEADER OSV OPPDATERES
	// 		$scope.user = user;
	// 		console.log("$scope.user - HomeController");
	// 		console.log($scope.user);
	// 	}
	// }
	
	function sortByRating(bars){
		var topRated = bars.sort(function(a,b){
			return b.rating - a.rating;
		});
		return topRated;
	}
});