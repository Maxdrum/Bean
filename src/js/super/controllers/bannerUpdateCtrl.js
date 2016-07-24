/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('BannerUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.image = "";
    $scope.url = "";
    $scope.imageFiles = [];


    $scope.id = $stateParams.bannerId;
    var getBannerApi= X_context.api + "banner/list";
    var bannerUpdateApi = X_context.api + "banner/update";
    console.log( $scope.id);



    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.goBack = function(){
        window.history.back();
    };

    function getPageData(){
        $http.post(getBannerApi,{
            bannerId : $scope.id,
            storeId : 0
        }).success( function(data){
            $scope.url = data.data[0].url;
            $scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));
        });
    }
    getPageData();


    $scope.update = function(){
        if ($scope.imageFiles && $scope.imageFiles.length > 0) {

            Upload.upload({
                url: X_context.api + 'img/addStoreBannerImg',
                file: $scope.imageFiles,
                fields: {
                    //"Authorization": X_context.authorization,
                    "storeId": 0,
                    "bannerId": $scope.id
                },
                arrayKey : ""
            }).progress(function (evt) {

            }).success(function (data, status, headers, config) {
                $scope.imageFiles = [];
                if(!$scope.url)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                    $http.post(bannerUpdateApi, {
                            "bannerId":$scope.id,
                            storeId : 0,
                            "url" : $scope.url,
                            "image" : data.data[0]
                        }

                    ).success(function(data){
                            $state.transitionTo('bannerManage')
                        });
            });

        } else {
            $scope.imageFiles = [];
            if(!$scope.url)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                $http.post(bannerUpdateApi, {
                        "bannerId":$scope.id,
                        storeId : 0,
                        "url" : $scope.url
                    }

                ).success(function(data){
                        $state.transitionTo('bannerManage')
                    });

        }

    };


    $scope.removeImg = function(index) {
        _.pullAt($scope.imageFiles, index);
    };

    $scope.goBack = function(){
        $state.go('bannerManage')
    }

});

