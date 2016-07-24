/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_PropertyAdmin').controller('TypePictureController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.image = "";
    $scope.imageFiles = [];


    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.saveBanner = function(){
        if($scope.imageFiles.length == 0)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
        if ($scope.imageFiles && $scope.imageFiles.length > 0) {

            Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.imageFiles,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 640,
                    "height": 200
                },
                arrayKey : ""
            }).progress(function (evt) {

            }).success(function (data, status, headers, config) {
                $scope.imageFiles = [];
                $rootScope.$broadcast('alerts',{type:'success',message:"图片上传成功！"});
            });

        } else {
            $scope.imageFiles = [];
        }

    };

});
