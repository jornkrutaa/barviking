var myApp = angular.module('myApp');

myApp.controller('UploadController', function($scope, $http, $interval, $state) {
    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        console.log(files);
        console.log(files[0]);
        fd.append("file", files[0]);
        //  var imgBlob = new Blob([files[0]], {type: files[0].type});
        //  console.log(imgBlob);
        // fd.append("file", imgBlob);
        
        $http.post("/uploadImage", fd, {
            withCredentials: true,
            headers: {'Content-Type': undefined,
                            'name':  files[0].name, 
                            'size': files[0].size, 
                            'type': files[0].type
                    },
            transformRequest: angular.identity
        }).success(function(){}).error(function(){});
    };
});