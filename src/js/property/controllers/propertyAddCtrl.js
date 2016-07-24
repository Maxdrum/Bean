/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_PropertyAdmin').controller('PropertyAddController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.title = "";
    $scope.parentid = "1";
    var one = false;
    //$scope.image = "";
    //$scope.imageFiles = [];

    //var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/;
    var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9]|[\s])+)$/;
    var typeAddApi = X_context.api + "services/add";

    //$scope.$watch('files', function (newImg, oldImg) {
    //    _.forEach(newImg, function (img, key) {
    //        $scope.imageFiles.push(img);
    //    });
    //});

    //$scope.saveType = function(){
    //    if($scope.imageFiles.length == 0)
    //        return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
    //    if ($scope.imageFiles && $scope.imageFiles.length > 0) {
    //
    //        Upload.upload({
    //            url: X_context.api + 'img/addCommonImg',
    //            file: $scope.imageFiles,
    //            fields: {
    //                "width": 100,
    //                "height": 100
    //            },
    //            arrayKey : ""
    //        }).progress(function (evt) {
    //
    //        }).success(function (data, status, headers, config) {
    //            $scope.imageFiles = [];
    //            if(!$scope.title)
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
    //            if($scope.title && !specReg.test($scope.title))
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的二级分类！"});
    //            $http.post(typeAddApi,{
    //
    //                    "title" : $scope.title,
    //                    "parentid" : $scope.parentid,
    //                    "image" : data.data[0]
    //
    //                }
    //            ).success(function(data){
    //
    //                    $state.transitionTo('typeManage')
    //                });
    //        });
    //
    //    } else {
    //        $scope.imageFiles = [];
    //    }
    //
    //};


    $scope.saveType = function(){
        if(!$scope.title)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
        else if($scope.title && !specReg.test($scope.title))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的二级分类！"});
        else{
            if(one == true)return;
            one = true;
                $http.post(typeAddApi,{
                    "title" : $scope.title,
                    "parentId" : $scope.parentid
                }).success(function(){
                    $state.transitionTo('typeManage')

                })
        }

    }
});
