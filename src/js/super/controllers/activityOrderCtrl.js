/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ActivityOrderController', function($scope,$http,$state,$location,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 20;
    $scope.pageNum = null;
    $scope.currentOrderList = [];
    $scope.orderHandle = null;
    $scope.orderRemove = null;
    $scope.disableHandle = true;
    $scope.countTotal = null;


    var orderListApi = X_context.api + "activity/listAllEnroll";
    var orderManageApi = X_context.api + "activity/cancelEnroll";
    //var payRefundApi = X_context.api + "pay/refund";


    function getPageData(){

        $http.post(orderListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentOrderList = data.data || [];
                $scope.currentOrderList = currentOrderList;
                if(data.data.length != 0){
                    $scope.totalPrice = data.data[0].totalPrice;
                    $scope.countTotal = data.data[0].countTotal;
                    $scope.pageNum = ($scope.countTotal  && currentOrderList.length >= 1)
                        ? Math.ceil($scope.countTotal / $scope.pageSize)
                        : 1;
                }else {
                    $scope.countTotal = 0;
                    $scope.pageNum = 0;
                    $scope.sumAmount = 0;
                }
            });
    }
    getPageData();


    $scope.$watch('currentPage',function(){
        getPageData();
    });

    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    }
    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    }

    $scope.setDeleteAccount = function(enrollId,paidSn){
        $scope.orderRemove = enrollId;
        $scope.paidSn = paidSn;
    }


    $scope.orderCancel = function(enrollId){

        $http.post(orderManageApi,{
            "enrollId" : $scope.orderRemove

        }).success(function(){
            getPageData();
        });
    }

    //$scope.payRefund = function(id){
    //    console.log($scope.paidSn);
    //    if($scope.paidSn){
    //        console.log($scope.paidSn);
    //        $http.post(payRefundApi,{
    //            storeId : X_context.storeId,
    //            "orderId" : $scope.orderRemove
    //        }).success(function(){
    //            getPageData();
    //        });
    //    }
    //
    //}

});






