/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('AdvertisementUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.image = "";
    $scope.url = "";
    $scope.linkFlag = "";
    $scope.imageFiles = [];


    $scope.id = $stateParams.bannerId;
    var urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
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
            storeId : X_context.storeId
        }).success( function(data){
            $scope.url = data.data[0].url;
            $scope.linkFlag = data.data[0].linkFlag;
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
                    "storeId": X_context.storeId,
					"bannerId": $scope.id
                },
                arrayKey : ""
            }).progress(function (evt) {

            }).success(function (data, status, headers, config) {
                $scope.imageFiles = [];
                if(!$scope.url)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                if($scope.linkFlag==1){
                    if($scope.url && !urlReg.test($scope.url))
                        return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确填写外部链接！"});
                    $http.post(bannerUpdateApi, {
                            "bannerId":$scope.id,
                            storeId : X_context.storeId,
                            "url" : $scope.url,
                            "linkFlag" : $scope.linkFlag,
                            "image" : data.data[0]
                        }

                    ).success(function(data){
                            $state.transitionTo('advertisementManage')
                        });
                }else{
                    $http.post(bannerUpdateApi, {
                            "bannerId":$scope.id,
                            storeId : X_context.storeId,
                            "url" : $scope.url,
                            "linkFlag" : $scope.linkFlag,
                            "image" : data.data[0]
                        }

                    ).success(function(data){
                            $state.transitionTo('advertisementManage')
                        });
                }

            });

        } else {
            $scope.imageFiles = [];
            if(!$scope.url)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            //if($scope.url && !urlReg.test($scope.url))
            //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确填写外部链接！"});
            if($scope.linkFlag==1){
                if($scope.url && !urlReg.test($scope.url))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确填写外部链接！"});
                $http.post(bannerUpdateApi, {
                        "bannerId":$scope.id,
                        storeId : X_context.storeId,
                        "url" : $scope.url,
                        "linkFlag" : $scope.linkFlag
                    }

                ).success(function(data){
                        $state.transitionTo('advertisementManage')
                    });
            }else{
                $http.post(bannerUpdateApi, {
                        "bannerId":$scope.id,
                        storeId : X_context.storeId,
                        "url" : $scope.url,
                        "linkFlag" : $scope.linkFlag
                    }

                ).success(function(data){
                        $state.transitionTo('advertisementManage')
                    });
            }

        }

    };


    $scope.removeImg = function(index) {
        _.pullAt($scope.imageFiles, index);
    };

    $scope.goBack = function(){
        $state.go('advertisementManage')
    }

});

