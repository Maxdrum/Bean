/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MemberManageController', function($scope,$http,$state,$location,$rootScope){
    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.currentMemberList = [];
    $scope.deleteStore = null;
    $scope.flag = 0;

    $scope.pageSize = 20;
    $scope.pageNum = null;

    var memberListApi = X_context.api + "member/list";
    var closeShopApi = X_context.api + "store/update";

    function getPageData(one){
        var currentStart = new Date($scope.startDate);
        var currentEnd = new Date($scope.endDate);
        var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
        var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
        console.log(currentStart,endCurrentDate);
        $http.post(memberListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize,
            mobile : $scope.phone ? $scope.phone : null,
            flag : parseInt($scope.flag),
            regStartDate : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
            regEndDate : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate
        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentMemberList = data.data || [];
                $scope.currentMemberList = currentMemberList;
                if((one==false) && data.data.length == 0){
                    $rootScope.$broadcast('alerts',{type:'danger',message:"未找到此会员，请正确输入信息后重试！"});
                    $scope.total = 0;
                    $scope.pageNum = 0;
                }
                if(data.data.length != 0){
                    var total = data.data[0].total;
                    $scope.total = data.data[0].total;
                    $scope.pageNum = (total  && currentMemberList.length >= 1)
                        ? Math.ceil(total / $scope.pageSize)
                        : 1;
                }
                if((one==true) && data.data.length == 0){
                    $scope.total = 0;
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

    $scope.setDeleteShop = function(id){
        $scope.deleteStore = id;
    }
    $scope.closeShop = function(id){
        $http.post(closeShopApi,
            {
                storeId : X_context.storeId,
                "id": $scope.deleteStore,
                "isEnable": "0"
            }
        ).success(function(data){
                getPageData();
            });
    };

    //date
    $scope.today = function() {
        $scope.endDate = new Date();
    };
    $scope.today();

    $scope.former = function() {
        $scope.startDate = new Date(2015,11,1);
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




