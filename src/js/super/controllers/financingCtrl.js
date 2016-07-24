/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('FinancingController', function($scope,$http,$state,$stateParams,$location,Upload,$rootScope){

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
    $scope.totalCount = null;


    var orderListApi = X_context.api + "servicesOrder/listFinancing";
    var orderManageApi = X_context.api + "servicesOrder/update";

    function getPageData(one){

        $http.post(orderListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentOrderList = data.data || [];
                $scope.currentOrderList = currentOrderList;
                if((one==false) && data.data.length == 0)
                {
                    $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关订单，请正确输入信息后重试！"});
                    $scope.totalCount = 0;
                    $scope.pageNum = 0;
                }
                if(data.data.length != 0){
                    $scope.totalCount = data.data[0].totalCount;
                    $scope.pageNum = ($scope.totalCount  && currentOrderList.length >= 1)
                        ? Math.ceil($scope.totalCount / $scope.pageSize)
                        : 1;
                }
                if((one==true) && data.data.length == 0)
                {
                    $scope.totalCount = 0;
                    $scope.pageNum = 0;
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

    $scope.setDeleteAccount = function(id,paidSn){
        $scope.orderRemove = id;
        $scope.paidSn = paidSn;
    }


    $scope.orderCancel = function(id){

        $http.post(orderManageApi,{
            //storeId : X_context.storeId,
            "_id" : $scope.orderRemove,
            "orderStatus" : "2"
        }).success(function(){
            getPageData();
        });
    }


    $scope.setHandle = function(id){
        $scope.orderHandle = id;
    }

    $scope.handle = function(id){

        $http.post(orderManageApi,{
            //storeId : X_context.storeId,
            "_id" : $scope.orderHandle,
            "orderStatus" : "1"
        }).success(function(){
            getPageData();
        });
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



