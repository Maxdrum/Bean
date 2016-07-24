/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ActivityManageController', function($scope,$http,$state,$location,$rootScope){
    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.currentActivityList = [];
    $scope.pageSize = 20;
    $scope.pageNum = null;

    var activityListApi = X_context.api + "activity/listAll";
    var deleteActivityApi = X_context.api + "activity/cancel";


    function getPageData(){

        $http.post(activityListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentActivityList = data.data || [];
                $scope.currentActivityList = currentActivityList;
                if(data.data.length != 0){
                    var countTotal = data.data[0].countTotal;
                    $scope.countTotal = data.data[0].countTotal;
                    $scope.pageNum = (countTotal  && currentActivityList.length >= 1)
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

    $scope.setDeleteActivity = function(id){
        $scope.deleteAct = id;
    }
    $scope.deleteActivity = function(id){
        $http.post(deleteActivityApi,
            {
                "activityId" : $scope.deleteAct

            }
        ).success(function(data){
                getPageData();
            }).error(function(data){
                if(data.code == 500){
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"该活动已有人报名，不可删除！"});
                }
            })
    };

});





