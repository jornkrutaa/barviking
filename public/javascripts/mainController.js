var testApp = angular.module('testApp',[]);

testApp.controller('MainController', function($scope) {
  $scope.greeting = 'Hola!';
  var connection =  mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password : '',
			port : 3306,
			database:'barcrawl'
		});
		connection.query('SELECT * FROM user_account',function(err,rows){
			if(err){
				console.log("Error Selecting : %s ",err );
			}
			console.log(rows);
      		$scope.users = rows;
			connection.end();
		});
});