/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('OrderDetailController', function($scope,$http,$stateParams,$state,$rootScope){
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

    $scope.flag2 = X_context.flag2;

    var orderListApi = X_context.api + "order/listAll";
    var orderManageApi = X_context.api + "order/update";
    var payRefundApi = X_context.api + "pay/refund";
    var pointReturnApi = X_context.api + "order/returnPoint";
    console.log( $scope.orderId);

    function getPageData(){
        $http.post(orderListApi,{
            orderId : $scope.orderId,
            storeId : X_context.storeId
        }).success(function(data){
                $scope.orderSn = data.data[0] ? data.data[0].orderSn : null;
                $scope.createDate = data.data[0] ? data.data[0].createDate : null;
                $scope.phone = data.data[0] ? data.data[0].phone : null;
                $scope.productPrice = data.data[0] ? data.data[0].productPrice : null;
                $scope.orderStatus = data.data[0] ? data.data[0].orderStatus : null;
                $scope.paymentMethod = data.data[0] ? data.data[0].paymentMethod : null;
                $scope.address = data.data[0] ? data.data[0].address : null;
                $scope.orderDetail = data.data[0] ? data.data[0].orderDetail : null;
                $scope.shippingPrice = data.data[0] ? data.data[0].shippingPrice : null;
                $scope.totalPrice = data.data[0] ? data.data[0].totalPrice : null;
                $scope.point = data.data[0] ? data.data[0].point : null;
                $scope.createDate = data.data[0] ? data.data[0].createDate : null;
                $scope.paidTime = data.data[0] ? data.data[0].paidTime : null;
                $scope.modifyDate = data.data[0] ? data.data[0].modifyDate : null;
                $scope.paidSn = data.data[0] ? data.data[0].paidSn : null;
                $scope.receiver = data.data[0] ? data.data[0].receiver : null;
            $scope.orderOne = {
                id : data.data[0] ? data.data[0].id : null,
                address : data.data[0] ? data.data[0].address : null,
                total : data.data[0] ? data.data[0].totalPrice : null,
                carriage: data.data[0] ? data.data[0].shippingPrice : null,
                orderpills:[]

            };
            if(data.data[0]){
                _.forEach(data.data[0].orderDetail,function(item){

                    $scope.orderOne.orderpills.push({
                        quantity : item.quantity,
                        productName:item.productName,
                        id:item.id,
                        unitPrice:item.unitPrice
                    });
                })
                $scope.orderpills.push($scope.orderone);
            }


            });
    }
    getPageData();


    $scope.orderCancel = function(){

        $http.post(orderManageApi,{
            storeId : X_context.storeId,
            "id" : $scope.orderId,
            "orderStatus" : "订单已取消"
        }).success(function(){
            getPageData();
        });
    }

    $scope.payRefund = function(id){
        console.log($scope.paidSn);
        if($scope.paidSn){
            console.log($scope.paidSn);
            $http.post(payRefundApi,{
                storeId : X_context.storeId,
                "orderId" : $scope.orderId
            }).success(function(){
                getPageData();
            });
        }

    }

    $scope.pointReturn = function(id){

            $http.post(pointReturnApi,{
                storeId : X_context.storeId,
                "orderId" : $scope.orderId
            }).success(function(){
                getPageData();
            });

    }


    //$scope.setHandle = function(orderId){
    //    $scope.orderHandle = orderId;
    //}

    $scope.handle = function(){

        $http.post(orderManageApi,{
            "id" : $scope.orderId,
            "orderStatus" : "订单已处理"
        }).success(function(){
			$rootScope.$broadcast('alerts',{type:'info',message:"订单已经处理！"});
			$scope.orderStatus = "订单已处理";
            //$state.transitionTo('orderManage');
        });
    }



});
