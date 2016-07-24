/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponCountController', function($scope,$http,$state,$location){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 10;
    $scope.currentCouponList = [];
    $scope.pageNum = null;
    $scope.totalCount = null;

    var shoppingListApi = X_context.api + "coupon/statByStore";


    function getPageData(){

        $http.post(shoppingListApi,{
            storeId : X_context.storeId,
            page : $scope.currentPage,
            size : $scope.pageSize
        })
            .success(function(data){
                var res = data.data;
                $location.search({'page': $scope.currentPage});
                var currentCouponList = res.coupon || [];
                $scope.currentCouponList = currentCouponList;

                var totalCount = res.page.total;
                $scope.totalCount = totalCount;
                $scope.pageNum = (totalCount  && currentCouponList.length >= 1)
                    ? Math.ceil(totalCount / $scope.pageSize)
                    : 1;

            }).error(function(resp){
                $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
            });
    }
    getPageData();


    $scope.getPageData = getPageData;

    $scope.$watch('currentPage',function(){
        getPageData();
    });


    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    };

    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    };
});

