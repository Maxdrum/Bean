/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('ShopAnnouncementController', function($scope,$http,$state,$rootScope){
    $scope.annTitle = "";
    $scope.announcement = "";

    var AnnouncementList = X_context.api + "store/list";
    var updateAnnouncement = X_context.api + "store/update";

    $http.post(AnnouncementList,{

        storeId : X_context.storeId
    }).success( function(data){
        $scope.annTitle = data.data[0].annTitle;
        $scope.announcement = data.data[0].announcement;
    });

    $scope.saveAnnouncement = function(){
        if(!$scope.annTitle || !$scope.announcement)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后提交！"});
        $http.post(updateAnnouncement,{
                storeId : X_context.storeId,
                "annTitle" : $scope.annTitle ? $scope.annTitle : ' ',
                "announcement" : $scope.announcement ? $scope.announcement : ' '
            }
        ).success(function(data){
                $rootScope.$broadcast('alerts',{type:'success',message:"提交成功！"});
                $state.reload();
            });
    };
});
