var myApp = angular.module('myApp', ['ui.router','ui.bootstrap']);

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  // Now set up the states
  //jwt: 
  //$httpProvider.interceptors.push("AuthInterceptor");
  $stateProvider
    .state('bars', {
      url: "/bars",
      templateUrl: "/views/partials/bars.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "/views/partials/login.html"
    })
    .state('home', {
      url: "/home",
      views: {
        "": {
          templateUrl: "/views/partials/home.html"
        }
      }
    })
    .state('barprofile', {
      url: "/barprofile/:id",
      templateUrl: "/views/partials/barprofile.html"
    })
    .state('imageUpload', {
      url: "/imageUpload",
      templateUrl: "/views/partials/imageUpload.html"
    });    
  $urlRouterProvider.otherwise("/home");
})

//jwt
// function authInterceptor($window){
	
// 	return {
// 		// request: function(config){
// 		// 	if($window.localStorage.token){
// 		// 		config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
// 		// 	}
			
// 		// 	return config;
// 		// }
// 	}
// }