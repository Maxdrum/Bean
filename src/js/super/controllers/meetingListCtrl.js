/**
 * Created by qishi on 16/1/8.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MeetingListController', function($scope,$http,$stateParams,$location,$state,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 20;
    $scope.currentMeetingList = [];
    $scope.pageNum = null;
    $scope.deleteAccount = null;
    $scope.totalCount = null;


    var meetingListApi = X_context.api + "meeting/listRooms";
    var deleteMeetingApi = X_context.api + "meeting/deleteRoom";


    function getPageData(){
            $http.post(meetingListApi,{
                page : $scope.currentPage,
                pageSize : $scope.pageSize

            })
                .success(function(data){
                    $location.search({'page': $scope.currentPage});
                    var currentMeetingList = data.data || [];
                    $scope.currentMeetingList = currentMeetingList;

                        var total = data.data[0].total;
                        $scope.total = data.data[0].total;
                        $scope.pageNum = (total  && currentMeetingList.length >= 1)
                            ? Math.ceil(total / $scope.pageSize)
                            : 1;
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

    $scope.setDeleteAccount = function(id){
        $scope.deleteAccount = id;
    }

    $scope.deleteMeeting = function(){
        $http.post(deleteMeetingApi,
            {
                "roomId": $scope.deleteAccount
            }
        ).success(function(data){
                getPageData();
            }).error(function(data){
                if(data.code == 500){
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"此会议室已有订单，不能删除！"});
                }
            })
    };

    // Model to JSON for demo purpose
    $scope.$watch('currentMeetingList', function(list,old) {
        if(old.length <= 0 || list.length  == old.length+1 || list.length <= 0)return;
        let out = [];
        _.forEach(list,function(item,index){
            out.push({
                roomId : item.id,
                sort : index
            })
        });
        $http.post(X_context.api + 'meeting/updateSort',{
            sortArray : out
        }).success(function(){

        })

    },true);


});
