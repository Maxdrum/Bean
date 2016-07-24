/**
 * Created by qishi on 16/1/8.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MeetingUpdateController', function($scope,$http,$stateParams,$state,Upload,$rootScope){

    $scope.name = "";
    $scope.price = "";
    $scope.descr = "";
    $scope.subtitle = "";
    $scope.image = "";
    $scope.imageFiles = [];


    $scope.id = $stateParams.meetingId;
    var getMeetingApi= X_context.api + "meeting/listRooms";
    var meetingUpdateApi = X_context.api + "meeting/updateRoom";
    console.log( $scope.id);

    $http.post(getMeetingApi,{
        "roomId" : $scope.id

    }).success( function(data){
        $scope.name = data.data[0].name;
        $scope.price = data.data[0].price;
        $scope.descr = data.data[0].descr;
        $scope.subtitle = data.data[0].subTitle;
        $scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));

    });

    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.update = function(){

        if ($scope.imageFiles && $scope.imageFiles.length > 0) {

            Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.imageFiles,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 640,
                    "height": 400
                },
                arrayKey : ""
            }).progress(function (evt) {

            }).success(function (data, status, headers, config) {
                $scope.imageFiles = [];
                if(!$scope.name || !$scope.price || !$scope.descr)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                if(parseInt($scope.price) != $scope.price)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"价格为正整数，请重新输入！"});
                $http.post(meetingUpdateApi, {
                        "roomId":$scope.id,
                        "name" : $scope.name,
                        "price" : $scope.price,
                        "descr" : $scope.descr,
                        "subTitle" : $scope.subtitle,
                        "image" : data.data[0]

                    }

                ).success(function(data){
                        $rootScope.$broadcast('alerts',{type:'success',message:"会议室修改成功！"});
                        $state.reload();
                    });
            });

        } else {
            $scope.imageFiles = [];
            if(!$scope.name || !$scope.price || !$scope.descr)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            if(parseInt($scope.price) != $scope.price)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"价格为正整数，请重新输入！"});
            $http.post(meetingUpdateApi, {
                    "roomId":$scope.id,
                    "name" : $scope.name,
                    "price" : $scope.price,
                    "descr" : $scope.descr,
                    "subTitle" : $scope.subtitle

                }

            ).success(function(data){
                    $rootScope.$broadcast('alerts',{type:'success',message:"会议室修改成功！"});
                    $state.reload();
                });
        }

    };
});
