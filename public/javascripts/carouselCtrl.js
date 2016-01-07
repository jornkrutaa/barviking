var myApp = angular.module("myApp");

myApp.controller("CarouselCtrl", function($scope){
	$scope.myInterval = 10000;
  $scope.slides = [
    {
      image: '../images/testbar.jpg'
    },
    {
      image: '../images/classybar.jpg'
    },
    {
      image: '../images/classnyc.jpg'
    },
    {
      image: '../images/classroof.jpg'
    }
  ];
})