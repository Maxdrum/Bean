/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CompanyShowListController', function($scope,$http,$state,$stateParams,$location,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.currentInfoList = [];
    $scope.pageSize = 20;
    $scope.pageNum = null;

    var infoListApi = X_context.api + "info/listCompanyShow";
    var deleteInfoApi = X_context.api + "info/delCompanyInfo";


    function getPageData(){

        $http.post(infoListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentInfoList = data.data || [];
                $scope.currentInfoList = currentInfoList;
                if(data.data.length != 0){
                    var countTotal = data.data[0].countTotal;
                    $scope.countTotal = data.data[0].countTotal;
                    $scope.pageNum = (countTotal  && currentInfoList.length >= 1)
                        ? Math.ceil(countTotal / $scope.pageSize)
                        : 1;
                }else{
                    $scope.countTotal = 0;
                    $scope.pageNum = 0;
                }

            });
    }
    getPageData();

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

    $scope.setDeleteInfo = function(id){
        $scope.deleteInformation = id;
    }
    $scope.deleteInfo = function(id){
        $http.post(deleteInfoApi,
            {
                "activityId" : $scope.deleteInformation

            }
        ).success(function(data){
                getPageData();
            });
    };

});

