angular.module('ZJSY_PropertyAdmin')

.controller('MainController', function($scope,$http,$location){
        "use strict";


        $scope.leftShow = true;

        var getMeApi = X_context.api  + "user/getCurUser";

        $scope.isActive = function (route) {
            if(_.indexOf($location.path().split('/'),route.split('/')[1])>0){

                //if($location.path().indexOf(route) !=-1){
                return true;
            }else{
                return false;
            }

        }

        $scope.logout = function(){
            location.href = X_context.host + "/zjsy/admin/logout";
        }

        $scope.leftWidth = "220px";

        $scope.hide_left_panel = function(){
            $scope.leftWidth = "60px";
            $scope.leftShow = false;
        }

        $scope.show_left_panel = function(){
            $scope.leftShow = true;
            $scope.leftWidth = "220px";
        }

        getMe();

        function getMe(){
            $http.get(getMeApi,{
            }).
                success( function(data){
                    $scope.username = data.data[0].name;
                });
        }

});