/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MeetingOrderDetailController', function($scope,$http,$stateParams,$state,$rootScope){
    $scope.currentOrderList = [];
    $scope.currentDetailList = [];
    $scope.orderId = $stateParams.orderId;
    $scope.orderSn = "";
    $scope.createDate = "";
    $scope.phone = "";
    $scope.productPrice = "";
    $scope.orderStatus = "";
    $scope.paymentMethod = "";
    $scope.address = "";
    $scope.receiver = "";
    $scope.modifyDate = "";
    $scope.orderpills=[];
    $scope.orderHandle = null;
    $scope.orderRemove = null;

    var orderListApi = X_context.api + "meeting/listOrder";
    var orderManageApi = X_context.api + "meeting/cancelRent";
    var payRefundApi = X_context.api + "pay/meetingRefund";
    console.log( $scope.orderId);

    function getPageData(){
        $http.post(orderListApi,{
            "orderId" : $scope.orderId

        }).success(function(data){
            $scope.ordersn = data.data[0] ? data.data[0].orderSn : null;
            $scope.payamount = data.data[0] ? data.data[0].payAmount : null;
            $scope.meetingtime = data.data[0] ? data.data[0].meetingTime.split(",").join("点，") : null;
            $scope.orderstatus = data.data[0] ? data.data[0].orderStatus : null;
            $scope.paytype = data.data[0] ? data.data[0].payType : null;
            $scope.paystatus = data.data[0] ? data.data[0].payStatus : null;
            $scope.createddate = data.data[0] ? data.data[0].createdDate : null;
            $scope.payTime = data.data[0] ? data.data[0].payTime : null;
            $scope.modifyDate = data.data[0] ? data.data[0].modifyDate : null;
            $scope.contact = data.data[0] ? data.data[0].contact : null;
            $scope.mobile = data.data[0] ? data.data[0].mobile : null;
            $scope.company = data.data[0] ? data.data[0].company : null;
            $scope.meetingdate = data.data[0] ? data.data[0].meetingDate : null;
            $scope.roomName = data.data[0] ? data.data[0].roomName : null;
            $scope.remark = data.data[0] ? data.data[0].remark : null;

        });
    }
    getPageData();


    $scope.setDeleteAccount = function(id,paidSn){
        $scope.orderRemove = id;
        $scope.paidSn = paidSn;
    }


    $scope.orderCancel = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderId,
            "orderStatus" : "2"
        }).success(function(){
            getPageData();
            if($scope.paySn){
                $http.post(payRefundApi,{
                    "orderId" : $scope.orderId
                }).success(function(){
                    getPageData();
                });
            }
        }).error(function(data){
            if(data.code == 500){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"超过预定时间，不能取消！"});
            }
        })
    }

    //$scope.payRefund = function(id){
    //    if($scope.paySn){
    //        $http.post(payRefundApi,{
    //            "orderId" : $scope.orderId
    //        }).success(function(){
    //            getPageData();
    //        });
    //    }
    //
    //}


    $scope.setHandle = function(id){
        $scope.orderHandle = id;
    }

    $scope.handle = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderId,
            "orderStatus" : "1",
            "payStatus" : 'true'
        }).success(function(){
            getPageData();

        });
    }

    $scope.setPaidAccount = function(id){
        $scope.orderPaid = id;
    }

    $scope.orderPay = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderId,
            "payStatus" : 'true'
        }).success(function(){
            getPageData();
        });
    }


});

