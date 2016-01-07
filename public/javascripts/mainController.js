var myApp = angular.module('myApp');

myApp.controller('HomeController', function($scope, $http, $interval) {
	loadData();
	// $interval(function () {
	// 	loadData();
	// }, 300);
	function loadData(){
		$http.get('http://localhost:3000/getAllBars').success(function(data){
			$scope.bars = data;
			$scope.topRatedBars = sortByRating(data);
			console.log($scope.topRatedBars);
		})
	};
	
	function sortByRating(bars){
		var topRated = bars.sort(function(a,b){
			return b.rating - a.rating;
		});
		return topRated;
	}
});

