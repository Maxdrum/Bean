/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponListController', function($scope,$http,$state,$location,$stateParams,Upload,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 8;
    $scope.currentCouponList = [];
    $scope.currentCategoryList = [];
    $scope.pageNum = null;
    $scope.totalCount = null;
    $scope.deleteCouponId = null;

    var shoppingListApi = X_context.api + "coupon/list";
    var closeCouponApi = X_context.api + "coupon/close";


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

    $scope.$watch('allSelected',function(){
        _.forEach($scope.currentCouponList,function(item,key){
            item.deleteMark = $scope.allSelected;
        })
    });


    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    }
    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    }

    $scope.setCloseAccount = function(id){
        $scope.deleteCouponId = id;
    };

    $scope.close = function() {
        $http.post(closeCouponApi,{
            storeId : X_context.storeId,
            couponId : $scope.deleteCouponId
        })
            .success(function(data){
                if(data.status == 'OK') {
                    getPageData();
                    $rootScope.$broadcast('alerts',{type:'success',message:"关闭优惠券成功"});
                } else {
                    $rootScope.$broadcast('alerts',{type:'danger',message:"关闭优惠券出错"});
                }

            });
    }


});

