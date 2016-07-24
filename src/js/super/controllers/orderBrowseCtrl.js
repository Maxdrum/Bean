/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('OrderBrowseController', function($scope,$http,$stateParams,$state,$rootScope){
    $scope.currentOrderList = [];
    $scope.orderId = $stateParams.orderId;
    $scope.orderSn = "";
    $scope.createDate = "";
    $scope.phone = "";
    $scope.productPrice = "";
    $scope.orderStatus = "";
    $scope.paymentMethod = "";
    $scope.storeName = "";
    $scope.address = "";
    $scope.shippingPrice = "";
    $scope.modifyDate = "";
    $scope.receiver = "";
    $scope.orderpills=[];

    var orderListApi = X_context.api + "order/listAll";
    console.log( $scope.orderId);

    function getPageData(){
        $http.post(orderListApi,{
            orderId : $scope.orderId
            //storeId : X_context.storeId
        }).success(function(data){
            $scope.orderSn = data.data[0].orderSn;
            $scope.createDate = data.data[0].createDate;
            $scope.phone = data.data[0].phone;
            $scope.productPrice = data.data[0].productPrice;
            $scope.totalPrice = data.data[0].totalPrice;
            $scope.orderStatus = data.data[0].orderStatus;
            $scope.paymentMethod = data.data[0].paymentMethod;
            $scope.storeName = data.data[0].storeName;
            $scope.address = data.data[0].address;
            $scope.receiver = data.data[0].receiver;
            $scope.shippingPrice = data.data[0].shippingPrice;
            $scope.modifyDate = data.data[0].modifyDate;
            $scope.paidTime = data.data[0].paidTime;
            $scope.receiver = data.data[0].receiver;

            $scope.orderOne = {
                id : data.data[0].id,
                address : data.data[0].address,
                total :data.data[0].totalPrice,
                carriage:data.data[0].shippingPrice,
                orderpills:[]

            };
            _.forEach(data.data[0].orderDetail,function(item){

                $scope.orderOne.orderpills.push({
                    quantity : item.quantity,
                    productName:item.productName,
                    id:item.id,
                    unitPrice:item.unitPrice
                });
            })
            $scope.orderpills.push($scope.orderone);

        });
    }
    getPageData();

});





