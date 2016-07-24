/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('FinancingDetailController', function($scope,$http,$stateParams,$state,$rootScope){
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
    $scope.modifyDate = "";
    $scope.orderHandle = null;
    $scope.orderRemove = null;

    var orderListApi = X_context.api + "servicesOrder/listFinancing";
    var orderManageApi = X_context.api + "servicesOrder/update";
    console.log( $scope.orderId);

    function getPageData(){
        $http.post(orderListApi,{
            "_id" : $scope.orderId

        }).success(function(data){
            $scope.orderSn = data.data[0].orderSn;
            $scope.createDate = data.data[0].createdDate;
            $scope.phone = data.data[0].mobile;
            $scope.orderstatus = data.data[0].orderStatus == "0" ? '未处理' : (data.data[0].orderStatus == "1" ? '已处理' : '已取消');
            $scope.company = data.data[0].company;
            $scope.address = data.data[0].address;
            $scope.contactor = data.data[0].contactor;
            $scope.title = data.data[0].services.title;
            $scope.note = data.data[0].note;
            $scope.project = data.data[0].project;

        });
    }
    getPageData();


    $scope.orderCancel = function(){

        $http.post(orderManageApi,{
            "_id" : $scope.orderId,
            "orderStatus" : "2"
        }).success(function(){
            getPageData();
        });
    }


    //$scope.setHandle = function(orderId){
    //    $scope.orderHandle = orderId;
    //}

    $scope.handle = function(){

        $http.post(orderManageApi,{
            "_id" : $scope.orderId,
            "orderStatus" : "1"
        }).success(function(){
            getPageData();
        });
    }



});

