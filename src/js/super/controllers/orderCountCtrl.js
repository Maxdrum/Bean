/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('OrderCountController', function($scope,$http,$state,$location,$rootScope){
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
    $scope.currentStoreList = [];
    $scope.totalPrice = null;

    var orderListApi = X_context.api + "order/listAll";
    var storeListApi = X_context.api + "store/list";
    var countTotalApi = X_context.api + "order/countTotal";
    var sumAmountApi = X_context.api + "order/sumAmount";

    var categoryPromise = $http.post(storeListApi,{

    })
        .success(function(data){
            var currentStoreList = data.data || [];
            $scope.currentStoreList = currentStoreList;
        });

    var vm = $scope.multiSelect = {};
    $scope.multiSelect.options = [];

    vm.selection = function() {
        return _.where($scope.multiSelect.options, {checked: true});
    }

    //var totalPromise = $http.post(countTotalApi,{
    //
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

            $http.post(orderListApi,{
                storeId : $scope.store ? $scope.store.id : null,
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
                    if((one==false) && data.data.length == 0){
                        $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关订单，请正确输入信息后重试！"});
                        $scope.total = 0;
                        $scope.pageNum = 0;
                        $scope.sumAmount = 0;
                    }
                    if(data.data.length != 0){
                        var totalPrice = data.data[0].totalPrice;
                        $scope.totalPrice = data.data[0].totalPrice;
                        var total = data.data[0].total;
                        $scope.total = data.data[0].total;
                        $scope.pageNum = ($scope.total  && currentOrderList.length >= 1)
                            ? Math.ceil($scope.total / $scope.pageSize)
                            : 1;
                    }
                    if((one==true) && data.data.length == 0){
                        $scope.total = 0;
                        $scope.pageNum = 0;
                        $scope.sumAmount = 0;
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

    function getCount(){
        var handleStart = new Date($scope.startDate);
        var handleEnd = new Date($scope.endDate);
        var startHandleDate = handleStart.getFullYear() + '-' + (handleStart.getMonth() + 1) + '-' + handleStart.getDate();
        var endHandleDate = handleEnd.getFullYear().toString() + '-' + (handleEnd.getMonth() + 1).toString() + '-' + handleEnd.getDate().toString();
        $http.post(countTotalApi,{
            storeId : $scope.store ? $scope.store.id : null,
            orderStatus : "订单已处理",
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            phone : $scope.phone ? $scope.phone : null,
            startDate : (startHandleDate == "NaN-NaN-NaN") ? null : startHandleDate,
            endDate : (endHandleDate == "NaN-NaN-NaN") ? null : endHandleDate

        })
            .success(function(data){
                var countTotal = data.data[0].countTotal;
                $scope.countTotal = data.data[0].countTotal;
            });
    }
    getCount();
    $scope.getCount = getCount;


    function getCancelCount(){
        var cancelStart = new Date($scope.startDate);
        var cancelEnd = new Date($scope.endDate);
        var startCancelDate = cancelStart.getFullYear() + '-' + (cancelStart.getMonth() + 1) + '-' + cancelStart.getDate();
        var endCancelDate = cancelEnd.getFullYear().toString() + '-' + (cancelEnd.getMonth() + 1).toString() + '-' + cancelEnd.getDate().toString();
        $http.post(countTotalApi,{
            storeId : $scope.store ? $scope.store.id : null,
            orderStatus : "订单已取消",
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            phone : $scope.phone ? $scope.phone : null,
            startDate : (startCancelDate == "NaN-NaN-NaN") ? null : startCancelDate,
            endDate : (endCancelDate == "NaN-NaN-NaN") ? null : endCancelDate
        })
            .success(function(data){
                var countCancelTotal = data.data[0].countTotal;
                $scope.countCancelTotal = data.data[0].countTotal;
            });
    }
    getCancelCount();
    $scope.getCancelCount = getCancelCount;

    function getNoHandleCount(){
        var noStart = new Date($scope.startDate);
        var noEnd = new Date($scope.endDate);
        var startNoDate = noStart.getFullYear() + '-' + (noStart.getMonth() + 1) + '-' + noStart.getDate();
        var endNoDate = noEnd.getFullYear().toString() + '-' + (noEnd.getMonth() + 1).toString() + '-' + noEnd.getDate().toString();
        $http.post(countTotalApi,{
            storeId : $scope.store ? $scope.store.id : null,
            orderStatus : "未处理",
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            phone : $scope.phone ? $scope.phone : null,
            startDate : (startNoDate == "NaN-NaN-NaN") ? null : startNoDate,
            endDate : (endNoDate == "NaN-NaN-NaN") ? null : endNoDate
        })
            .success(function(data){
                var countNoHandleTotal = data.data[0].countTotal;
                $scope.countNoHandleTotal = data.data[0].countTotal;
            });
    }
    getNoHandleCount();
    $scope.getNoHandleCount = getNoHandleCount;

    function getSumCount(){
        var nowStart = new Date($scope.startDate);
        var nowEnd = new Date($scope.endDate);
        var startNowDate = nowStart.getFullYear() + '-' + (nowStart.getMonth() + 1) + '-' + nowStart.getDate();
        var endNowDate = nowEnd.getFullYear().toString() + '-' + (nowEnd.getMonth() + 1).toString() + '-' + nowEnd.getDate().toString();
        $http.post(sumAmountApi,{
            storeId : $scope.store ? $scope.store.id : null,
            orderStatus : $scope.orderStatus ? $scope.orderStatus : null,
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            phone : $scope.phone ? $scope.phone : null,
            startDate : (startNowDate == "NaN-NaN-NaN") ? null : startNowDate,
            endDate : (endNowDate == "NaN-NaN-NaN") ? null : endNowDate
        })
            .success(function(data){
                var sumAmount = data.data[0].money;
                $scope.sumAmount = data.data[0].money;
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






