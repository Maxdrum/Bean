/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('AdvertisementAddController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.url = "";
    $scope.image = "";
    $scope.imageFiles = [];
    $scope.linkFlag = 0;
    var one = false;

    var urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;
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
                            "storeId": X_context.storeId
                        },
                        arrayKey : ""
                    }).progress(function (evt) {

                    }).success(function (data, status, headers, config) {
                        $scope.imageFiles = [];
                        //if(!urlReg.test($scope.url)) return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入网址！"});

                        if($scope.linkFlag==1){
                            if($scope.url && !urlReg.test($scope.url)){
                                one = false;
                                return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确填写外部链接！"});
                            }

                            $http.post(advertisementAdd,{
                                    storeId : X_context.storeId,
                                    "url" : $scope.url,
                                    "image" : data.data[0],
                                    "linkFlag" : $scope.linkFlag
                                }
                            ).success(function(data){
                                    $state.transitionTo('advertisementManage')
                                });
                        }else{
                            $http.post(advertisementAdd,{
                                    storeId : X_context.storeId,
                                    "url" : $scope.url,
                                    "image" : data.data[0],
                                    "linkFlag" : $scope.linkFlag
                                }
                            ).success(function(data){
                                    $state.transitionTo('advertisementManage')
                                });
                        }

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


