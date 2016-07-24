/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CardController', function($scope,$http,$state,$location,$rootScope){
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
    $scope.totalPrice = null;

    var orderListApi = X_context.api + "order/listAll";

    function getPageData(one){

        var currentStart = new Date($scope.startDate);
        var currentEnd = new Date($scope.endDate);
        var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
        var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
        console.log(currentStart,endCurrentDate);
        $http.post(orderListApi,{
            storeId : X_context.storeId,
            page : $scope.currentPage,
            pageSize : $scope.pageSize,
            orderSn :  $scope.orderSn ? $scope.orderSn : null,
            paidSn :  $scope.paidSn ? $scope.paidSn : null,
            refundSn :  $scope.refundSn ? $scope.refundSn : null,
            isPaid : 1,
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
                }
                console.log($scope.paidSn);
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
