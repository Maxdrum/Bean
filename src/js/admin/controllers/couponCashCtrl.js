/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponCashController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    var two = false;

    var newCouponApi = X_context.api + "coupon/add";


    $scope.newCoupon = function(){
        if(two == true)return;
        two = true;
            var currentStart = new Date($scope.startDate);
            var currentEnd = new Date($scope.endDate);
            var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
            var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
            if($scope.discount >= $scope.money) {
                $rootScope.$broadcast('alerts',{type:'danger',message: '抵用金额必须小于消费金额'});
                return;
            }
            var postJson = {
                storeId : X_context.storeId,
                startDate : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
                endDate : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
                name : $scope.couponName,
                type : 2,
                amount : $scope.amount,
                threshold : $scope.money,
                discount : $scope.discount
            };
            $http.post(newCouponApi,postJson)
                .success(function(){
                    $state.transitionTo('couponList');
                }).error(function(resp){
                    $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
                })


    };


    //date
    $scope.former = function() {
        $scope.startDate = new Date();
    };
    $scope.former();

    $scope.afterward = function() {
        $scope.endDate = new Date(((new Date()).getTime() + 7*24*60*60*1000));
    };
    $scope.afterward();

    $scope.clear = function () {
        $scope.startDate = null;
        $scope.endDate = null;
    };

    // Disable weekend selection
    //$scope.disabled = function(date, mode) {
    //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    //};

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openStart = function($event) {
        $scope.status.openedStart = true;
    };

    $scope.openEnd = function($event) {
        $scope.status.openedEnd = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        openedStart : false,
        openedEnd : false
    };

});

