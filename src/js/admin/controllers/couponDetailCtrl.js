/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponDetailController', function($scope,$http,$stateParams){

    $scope.coupon = null;

    var getCouponApi = X_context.api + "coupon/get/" + $stateParams.couponId;

    $http.get(getCouponApi)
        .success(function(resp){
            if(resp.status == 'OK') {
                $scope.coupon = resp.data;
            } else {
                $rootScope.$broadcast('alerts',{type:'danger',message:"获取优惠券信息失败"});
            }
        }).error(function(resp){
            $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
        });

    $scope.goBack = function(){
        window.history.back();
    };

});
