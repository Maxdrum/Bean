/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ShopCreateController', function($scope,$http,$state,$rootScope,Upload,$q){
    $scope.storeName = "";
    //$scope.flag1 = "";
    $scope.contactor = "";
    $scope.phone = "";
    $scope.address = "";
    //$scope.adminId = "";
    $scope.loginName = "";
    $scope.password = "";
    $scope.propa = "";
    $scope.printSn = "";
    $scope.printKey = "";
    var one = false;
    $scope.image = "";
    $scope.imageFiles = [];

    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var shopAdd = X_context.api + "store/add";
    var shopUpdateApi = X_context.apiForApp + "store/update";

    //$scope.$watch('files', function (newImg, oldImg) {
    //    _.forEach(newImg, function (img, key) {
    //        $scope.imageFiles.push(img);
    //    });
    //});

    //$scope.saveStore = function(){
    //    if((!$scope.files || $scope.files.length == 0) || (!$scope.files2 || $scope.files2.length == 0))
    //        return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
    //    if(!$scope.title || !$scope.subtitle)
    //        return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
    //
    //    var listImgPromise = Promise.resolve();
    //    var bannerImgPromise = Promise.resolve();
    //    if ($scope.files && $scope.files.length > 0){
    //        listImgPromise = Upload.upload({
    //            url: X_context.api + 'img/addCommonImg',
    //            file: $scope.files,
    //            fields: {
    //                //"Authorization": X_context.authorization,
    //                "width": 100,
    //                "height": 100
    //            },
    //            arrayKey : ""
    //        })
    //    }
    //    if ($scope.files2 && $scope.files2.length > 0){
    //        bannerImgPromise = Upload.upload({
    //            url: X_context.api + 'img/addCommonImg',
    //            file: $scope.files2,
    //            fields: {
    //                //"Authorization": X_context.authorization,
    //                "width": 640,
    //                "height": 240
    //            },
    //            arrayKey : ""
    //        })
    //    }
    //
    //    $q.all([listImgPromise,bannerImgPromise]).then(function(datas){
    //        console.log(datas);
    //        $http.post(addInfoApi, {
    //                //"activityId":$scope.id,
    //                "title" : $scope.title,
    //                "subTitle" : $scope.subtitle,
    //                "content" : $scope.quill.getHTML(),
    //                "image" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
    //                "banner" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null,
    //                "showBanner" : ($scope.showBanner == true) ? 1 : 0
    //            }
    //
    //        ).success(function(data){
    //
    //                $state.transitionTo('parkList')
    //            });
    //    })
    //
    //};

    $scope.saveStore = function(){
            if((!$scope.files || $scope.files.length == 0) || (!$scope.files2 || $scope.files2.length == 0)){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
            }
            else if(!$scope.storeName || !$scope.contactor || !$scope.phone || !$scope.loginName || !$scope.password || !$scope.propa){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            }
            else if($scope.phone && !phoneReg.test($scope.phone)){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
            }else{
                if(one == true)return;
                one = true;
                $http.post(shopAdd,{

                        "storeName" : $scope.storeName,
                        //"isEnable" : $scope.flag1,
                        "contactor" : $scope.contactor,
                        "phone" : $scope.phone,
                        //"address" : $scope.address,
                        //"adminId" : $scope.adminId,
                        "propa" : $scope.propa,
                        "loginName" : $scope.loginName,
                        "password" : $scope.password,
                        "printSn" : $scope.printSn,
                        "printKey" : $scope.printKey

                    }
                ).success(function(data){

                        $scope.storeId = data.data[0].id;

                        var listImgPromise = Promise.resolve();
                        var appImgPromise = Promise.resolve();
                        if ($scope.files && $scope.files.length > 0){
                            listImgPromise = Upload.upload({
                                url: X_context.api + 'img/addStoreListImg',
                                file: $scope.files,
                                fields: {
                                    "storeId": $scope.storeId
                                },
                                arrayKey : ""
                            })
                        }
                        if ($scope.files2 && $scope.files2.length > 0){
                            appImgPromise = Upload.upload({
                                url: X_context.api + 'img/addCommonImg',
                                file: $scope.files2,
                                fields: {
                                    //"Authorization": X_context.authorization,
                                    "width": 317,
                                    "height": 214
                                },
                                arrayKey : ""
                            })
                        }

                        $q.all([listImgPromise,appImgPromise]).then(function(datas){
                            console.log(datas);
                            $http.post(shopUpdateApi, {
                                    storeId : $scope.storeId,
                                    "storeName" : $scope.storeName,
                                    //"isEnable" : $scope.flag1,
                                    "contactor" : $scope.contactor,
                                    "phone" : $scope.phone,
                                    //"address" : $scope.address,
                                    //"adminId" : $scope.adminId,
                                    "propa" : $scope.propa,
                                    "printSn" : $scope.printSn,
                                    "printKey" : $scope.printKey,
                                    "listImage" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
                                    "listAppImage" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null
                                }

                            ).success(function(data){

                                    $state.transitionTo('shopManage')
                                });
                        });

                        //if ($scope.imageFiles && $scope.imageFiles.length > 0) {
                        //
                        //    Upload.upload({
                        //        url: X_context.api + 'img/addStoreListImg',
                        //        file: $scope.imageFiles,
                        //        fields: {
                        //            //"Authorization": X_context.authorization,
                        //            "storeId": $scope.storeId
                        //        },
                        //        arrayKey : ""
                        //    }).progress(function (evt) {
                        //
                        //    }).success(function (data, status, headers, config) {
                        //        $scope.imageFiles = [];
                        //        if(!$scope.storeName || !$scope.contactor || !$scope.phone || !$scope.loginName || !$scope.password || !$scope.propa)
                        //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                        //        if($scope.phone && !phoneReg.test($scope.phone))
                        //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
                        //        //if(parseInt($scope.phone) != $scope.phone)
                        //        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入电话号码！"});
                        //        //if($scope.phone.length == 9 || $scope.phone.length == 10)
                        //        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
                        //        $http.post(shopUpdateApi,{
                        //
                        //                storeId : $scope.storeId,
                        //                "storeName" : $scope.storeName,
                        //                //"isEnable" : $scope.flag1,
                        //                "contactor" : $scope.contactor,
                        //                "phone" : $scope.phone,
                        //                //"address" : $scope.address,
                        //                //"adminId" : $scope.adminId,
                        //                "propa" : $scope.propa,
                        //                "printSn" : $scope.printSn,
                        //                "printKey" : $scope.printKey,
                        //                "listImage" : data.data[0]
                        //
                        //            }
                        //        ).success(function(data){
                        //                $state.transitionTo('shopManage')
                        //            });
                        //    });
                        //
                        //} else {
                        //    $scope.imageFiles = [];
                        //}
                    }).error(function(data){
                        if(data.code == 400){
                            return $rootScope.$broadcast('alerts',{type:'danger',message:"新建店铺出错，可能是账号名已被使用，请修改后重试！"});
                        }
                    })
            }


    };

});


