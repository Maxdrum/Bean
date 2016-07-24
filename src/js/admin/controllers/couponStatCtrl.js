/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponStatController', function($scope,$http,$stateParams){

    $scope.coupon = null;

    var getCouponStatApi = X_context.api + "coupon/stat/" + X_context.storeId + '/' + $stateParams.couponId;

    $http.get(getCouponStatApi)
        .success(function(resp){
            if(resp.status == 'OK') {
                $scope.coupon = resp.data;
            } else {
                $rootScope.$broadcast('alerts',{type:'danger',message:"获取优惠券统计信息失败"});
            }
        }).error(function(resp){
            $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
        });

    $scope.goBack = function(){
        window.history.back();
    };

});
