/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('BannerAddController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.url = "";
    var one = false;
    $scope.image = "";
    $scope.imageFiles = [];

    var advertisementAdd = X_context.api + "banner/add";

    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.saveAd = function(){
        if($scope.imageFiles.length == 0)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
        else{
            if(one == true)return;
            one = true;
                if ($scope.imageFiles && $scope.imageFiles.length > 0) {

                    Upload.upload({
                        url: X_context.api + 'img/addStoreBannerImg',
                        file: $scope.imageFiles,
                        fields: {
                            //"Authorization": X_context.authorization,
                            "storeId": 0
                        },
                        arrayKey : ""
                    }).progress(function (evt) {

                    }).success(function (data, status, headers, config) {
                        $scope.imageFiles = [];

                        $http.post(advertisementAdd,{
                                storeId : 0,
                                "url" : $scope.url,
                                "image" : data.data[0],
                                "linkFlag" : $scope.linkFlag
                            }
                        ).success(function(data){
                                $state.transitionTo('bannerManage')
                            });
                    });

                } else {
                    $scope.imageFiles = [];
                }
        }


    };


    $scope.removeImg = function(index) {
        _.pullAt($scope.imageFiles, index);
    };
});


