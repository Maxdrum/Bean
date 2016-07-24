/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CardBindingController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.allInPayAct = "";
    $scope.cardBinding = false;


    var getPayApi= X_context.apiForApp + "store/list";
    var cardUpdateApi = X_context.apiForApp + "store/update";

     $http.post(getPayApi,{
        storeId : X_context.storeId
        //category : 1,
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

    $scope.update = function(){
        $http.post(cardUpdateApi, {
                storeId : X_context.storeId,
                "allInPayAct" : $scope.allInPayAct,
                "allInPayProd" : $scope.allInPayProd,
                "allInPayBrh" : $scope.allInPayBrh

            }

        ).success(function(data){
                $rootScope.$broadcast('alerts',{type:'success',message:"修改成功！"});
                $rootScope.$broadcast('cardBinding');
                $state.reload();
            });
    };

    //$rootScope.$broadcast('cardBinding');


    //$scope.unbundling = function(){
    //    $http.post(cardUpdateApi, {
    //            storeId : X_context.storeId,
    //            "allInPayAct" : ""
    //        }
    //
    //    ).success(function(data){
    //            $rootScope.$broadcast('alerts',{type:'success',message:"解绑成功！"});
    //            $state.reload();
    //        });
    //};

});
