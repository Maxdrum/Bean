angular.module('ZJSY_Admin')

.controller('MainController', function($scope,$http,$location){
        "use strict";


        $scope.leftShow = true;
        $scope.cardBinding = false;
        $scope.flag2 = X_context.flag2;

        var getPayApi= X_context.apiForApp + "store/list";
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

        function getPayBind(){
            $http.post(getPayApi,{
                storeId : X_context.storeId
            })
                .success(function(data){
                    $scope.allInPayAct = data.data.detail[0].allInPayAct;
                    $scope.allInPayProd = data.data.detail[0].allInPayProd;
                    $scope.allInPayBrh = data.data.detail[0].allInPayBrh;
                    if(($scope.allInPayAct.length != 0) && ($scope.allInPayProd.length != 0) && ($scope.allInPayBrh.length != 0)){
                        $scope.cardBinding = false;
                    }else{
                        $scope.cardBinding = true;
                    }
                });
        }
        getPayBind();

        $scope.$on('cardBinding',function(e,data){
            getPayBind();
        });

});