/**
 * Created by qishi on 16/1/8.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MeetingAddController', function($scope,$http,$stateParams,$state,Upload,$rootScope){

    $scope.name = "";
    $scope.price = "";
    $scope.descr = "";
    var one = false;
    $scope.image = "";
    $scope.imageFiles = [];

    var roomAdd = X_context.api + "meeting/addRoom";

    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.saveMeeting = function(){
        if($scope.imageFiles.length == 0)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
        else if(!$scope.name || !$scope.price || !$scope.descr || !$scope.subtitle)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
        else if(parseInt($scope.price) != $scope.price)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"价格为正整数，请重新输入！"});
        else{
            if(one == true)return;
            one = true;
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

                        $http.post(roomAdd,{

                                "name" : $scope.name,
                                "price" : $scope.price,
                                "descr" : $scope.descr,
                                "subTitle" : $scope.subtitle,
                                "image" : data.data[0]

                            }
                        ).success(function(data){

                                $state.transitionTo('meetingList')
                            });
                    });

                } else {
                    $scope.imageFiles = [];
                }
        }

    };

});
