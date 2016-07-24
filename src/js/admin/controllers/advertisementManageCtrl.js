/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('AdvertisementManageController', function($scope,$http,$state,$location,$rootScope){
    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 20;
    $scope.pageNum = null;
    $scope.currentBannerList = [];
    $scope.totalPrice = null;
    $scope.imageFiles = [];
    $scope.deleteAd = null;

    var bannerListApi = X_context.api + "banner/list";
    var deleteBannerApi = X_context.api + "banner/delete";

    function getPageData(){


        $http.post(bannerListApi,{
            storeId : X_context.storeId,
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentBannerList = data.data || [];
                $scope.currentBannerList = currentBannerList;
                _.forEach($scope.currentBannerList,function(item,dev){
                    item.image = X_context.devHost + item.image;
                });
                //if((one==false) && data.data.length == 0){
                //    $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关banner，请正确输入信息后重试！"});
                //    $scope.total = 0;
                //    $scope.pageNum = 0;
                //}
                //if(data.data.length != 0){
                //    var total = data.data[0].total;
                //    $scope.total = data.data[0].total;
                //    $scope.pageNum = ($scope.total  && currentOrderList.length >= 1)
                //        ? Math.ceil($scope.total / $scope.pageSize)
                //        : 1;
                //}
                //if((one==true) && data.data.length == 0){
                //    $scope.total = 0;
                //    $scope.pageNum = 0;
                //}
            });
    }
    getPageData();
    //$scope.getPageData = getPageData;

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

    $scope.setDeleteBanner = function(id){
        $scope.deleteAd = id;
    }
    $scope.deleteBanner = function(id){
        $http.post(deleteBannerApi,
            {
                storeId : X_context.storeId,
                "bannerId": $scope.deleteAd

            }
        ).success(function(data){
                getPageData();
            });
    };
    $scope.$watch('currentBannerList', function(list,old) {
        if(old.length <= 0 || list.length  == old.length+1 || list.length <= 0)return;
        let out = [];
        _.forEach(list,function(item,index){
            out.push({
                bannerId : item.id,
                sort : index
            })
        });
        $http.post(X_context.api + 'banner/updateSort',{
            sortArray : out
        }).success(function(){

        })

    },true);

});

