/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('OrderManageController', function($scope,$http,$state,$location,$rootScope){
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
    $scope.disableFollow = true;
    $scope.disableMajorType =true;
    $scope.disableHandle = true;
    $scope.majorType = {};
    $scope.totalPrice = null;
    $scope.countTotal = null;

    $scope.flag2 = X_context.flag2;


    var orderListApi = X_context.api + "order/listAll";
    var orderManageApi = X_context.api + "order/update";
    var countTotalApi = X_context.api + "order/countTotal";
    var sumAmountApi = X_context.api + "order/sumAmount";
    var payRefundApi = X_context.api + "pay/refund";
    var pointReturnApi = X_context.api + "order/returnPoint";

    //var currentStart = new Date($scope.startDate);
    //var currentEnd = new Date($scope.endDate);
    //var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
    //var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
    //console.log(startDate)

    //var totalPromise = $http.post(countTotalApi,{
    //    storeId : X_context.storeId
    //})
    //    .success(function(data){
    //        var countTotal = data.data[0].countTotal;
    //        $scope.countTotal = data.data[0].countTotal;
    //    });

    function getPageData(one){
        var currentStart = new Date($scope.startDate);
        var currentEnd = new Date($scope.endDate);
        var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
        var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
        console.log(currentStart,endCurrentDate);
        //return;
       //console.log($scope.currentOrderList,$scope.orderSn);
       // if(_.find($scope.currentOrderList,{orderSn : $scope.orderSn}) == null)
       //     return alert("未找到相关订单，请正确输入信息后重试");

            $http.post(orderListApi,{
                storeId : X_context.storeId,
                page : $scope.currentPage,
                pageSize : $scope.pageSize,
                orderSn :  $scope.orderSn ? $scope.orderSn : null,
                phone : $scope.phone ? $scope.phone : null,
                orderStatus : $scope.orderStatus ? $scope.orderStatus : null,
                startDate : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
                endDate : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate

            })
                .success(function(data){
                    $location.search({'page': $scope.currentPage});
                    var currentOrderList = data.data || [];
                    $scope.currentOrderList = currentOrderList;
                    if((one==false) && data.data.length == 0)
                    {
                        $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关订单，请正确输入信息后重试！"});
                        $scope.totalPrice = 0;
                        $scope.total = 0;
                        $scope.pageNum = 0;
                        $scope.sumAmount = 0;
                        console.log($scope.one);
                    }
                    if(data.data.length != 0){
                        console.log("+++",$scope.one);
                        $scope.totalPrice = data.data[0].totalPrice;
                        $scope.total = data.data[0].total;
                        $scope.pageNum = ($scope.total  && currentOrderList.length >= 1)
                            ? Math.ceil($scope.total / $scope.pageSize)
                            : 1;
                    }
                    if((one==true) && data.data.length == 0)
                    {
                        $scope.totalPrice = 0;
                        $scope.total = 0;
                        $scope.pageNum = 0;
                        $scope.sumAmount = 0;
                        console.log("KKKK",$scope.one);
                    }
                });
    }
    getPageData(true);
    $scope.getPageData = getPageData;

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

    $scope.setDeleteAccount = function(id,paidSn,paymentMethod){
        $scope.orderRemove = id;
        $scope.paidSn = paidSn;
        $scope.paymentMethod = paymentMethod;
    }


    $scope.orderCancel = function(id){

        $http.post(orderManageApi,{
            storeId : X_context.storeId,
            "id" : $scope.orderRemove,
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
                "orderId" : $scope.orderRemove
            }).success(function(){
                getPageData();
            });
        }

    }

    $scope.pointReturn = function(id){

            $http.post(pointReturnApi,{
                storeId : X_context.storeId,
                "orderId" : $scope.orderRemove
            }).success(function(){
                getPageData();
            });

    }


    $scope.setHandle = function(id){
        $scope.orderHandle = id;
    }

    $scope.handle = function(id){
        $http.post(orderManageApi,{
            storeId : X_context.storeId,
            "id" : $scope.orderHandle,
            "orderStatus" : "订单已处理"
        }).success(function(){
			$rootScope.$broadcast('alerts',{type:'info',message:"订单已经处理！"});
			//取消订单后留在当前页
			var curOrder = $scope.currentOrderList;
			for(var i=0; i< curOrder.length; i++) {
				var order = curOrder[i];
				if(order.id == $scope.orderHandle) { // 找到当前正在修改的订单
					order.orderStatus = "订单已处理";
					break;
				}
			}
        });
    }






    function getSumCount(){
        var nowStart = new Date($scope.startDate);
        var nowEnd = new Date($scope.endDate);
        var startNowDate = nowStart.getFullYear() + '-' + (nowStart.getMonth() + 1) + '-' + nowStart.getDate();
        var endNowDate = nowEnd.getFullYear().toString() + '-' + (nowEnd.getMonth() + 1).toString() + '-' + nowEnd.getDate().toString();
        $http.post(sumAmountApi,{
            storeId : X_context.storeId,
            orderStatus : $scope.orderStatus ? $scope.orderStatus : null,
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            phone : $scope.phone ? $scope.phone : null,
            startDate : (startNowDate == "NaN-NaN-NaN") ? null : startNowDate,
            endDate : (endNowDate == "NaN-NaN-NaN") ? null : endNowDate
        })
            .success(function(data){
                var sumAmount = data.data[0].money;
                $scope.sumAmount = data.data[0].money;
                var point = data.data[0].point;
                $scope.point = data.data[0].point;
            });
    }
    getSumCount();
    $scope.getSumCount = getSumCount;


//date
    $scope.today = function() {
        $scope.endDate = new Date();
    };
    $scope.today();

    $scope.former = function() {
        $scope.startDate = new Date((new Date()- 30*24*60*60*1000));
    };
    $scope.former();

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