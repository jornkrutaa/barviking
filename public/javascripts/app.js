var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider) {
  //
  //
  // Now set up the states
  $stateProvider
    .state('contacts', {
      url: "/contacts",
      templateUrl: "/views/partials/contacts.html"
    });
     $stateProvider
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