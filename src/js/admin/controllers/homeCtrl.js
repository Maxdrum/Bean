"use strict";
angular.module('ZJSY_Admin').controller('HomeController', function($scope,$http){
        console.log('asd');
        $scope.name = "swain";
        $scope.title = `Hello ${$scope.name}`;

        //$http.get('http://192.168.3.226:8080/scaffold/api/user/1 ').success(function(data){
        //        console.log('data',data)
        //});
});