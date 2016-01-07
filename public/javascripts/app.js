var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  //
  // Now set up the states
  $stateProvider
    .state('bars', {
      url: "/bars",
      templateUrl: "/views/partials/bars.html"
    })
    .state('home', {
      url: "/home",
      views: {
        "": {
          templateUrl: "/views/partials/home.html"
        }
      } 
    });    
  $urlRouterProvider.otherwise("/home");
});
