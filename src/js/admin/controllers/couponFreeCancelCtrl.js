/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponFreeCancelController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    var useCouponApi = X_context.api + "coupon/useMianZeng";

    $scope.cancel = function(){
        if(!$scope.serialNum)   return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入核销序列号！"});
        $http.post(useCouponApi,{
            storeId : X_context.storeId,
            serialNum : $scope.serialNum
        }).success(function(resp){
            if(resp.status == 'OK') {
                $state.reload();
                $rootScope.$broadcast('alerts',{type:'success',message:"核销完成！"});
            } else {
                $rootScope.$broadcast('alerts',{type:'danger',message:"核销失败！"});
            }

        }).error(function(resp){
            $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
        })
    }

});

