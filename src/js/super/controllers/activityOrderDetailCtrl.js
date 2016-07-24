/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ActivityOrderDetailController', function($scope,$http,$stateParams,$state,$rootScope){
    $scope.currentOrderList = [];
    $scope.currentDetailList = [];
    $scope.orderId = $stateParams.orderId;
    $scope.orderSn = "";
    $scope.createDate = "";
    $scope.phone = "";
    $scope.title = "";
    $scope.orderstatus = "";
    $scope.contactor = "";
    $scope.address = "";
    $scope.note = "";
    $scope.modifyDate = "";
    $scope.orderHandle = null;
    $scope.orderRemove = null;

    var orderListApi = X_context.api + "activity/listAllEnroll";
    var orderManageApi = X_context.api + "activity/cancelEnroll";
    console.log( $scope.orderId);

    function getPageData(){
        $http.post(orderListApi,{
            "enrollId" : $scope.orderId

        }).success(function(data){
            $scope.orderSn = data.data[0].enrollId;
            $scope.title = data.data[0].title;
            $scope.startDate = data.data[0].startDate;
            $scope.endDate = data.data[0].endDate;
            $scope.payamount = data.data[0].payAmount;
            $scope.username = data.data[0].userName;
            $scope.mobile = data.data[0].mobile;
            $scope.createDate = data.data[0].createdDate;
            $scope.paytype = data.data[0].payType == 1 ? '一卡通' : ((data.data[0].payType == 2 ? '线下支付' : (data.data[0].payType == 3 ? '积分' : '无')));
            $scope.paystatus = data.data[0].payType == 0 ? '无' : ((data.data[0].payStatus == 1)  ? '已支付' : '未支付');
            $scope.enrollstatus = data.data[0].enrollStatus;
            $scope.note = data.data[0].note;

        });
    }
    getPageData();


    $scope.orderCancel = function(){

        $http.post(orderManageApi,{
            "enrollId" : $scope.orderId,
            "orderStatus" : "2"
        }).success(function(){
            getPageData();
            //$state.transitionTo('activityOrder')
        });
    }


});

