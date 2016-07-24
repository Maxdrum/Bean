/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_PropertyAdmin').controller('PropertyUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.title = "";
    $scope.parentid = "";
    //$scope.image = "";
    //$scope.imageFiles = [];

    $scope._id = $stateParams.servicesId;

    //var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/;
    var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9]|[\s])+)$/;
    var getTypeApi = X_context.api + "services/list";
    var typeUpdateApi = X_context.api + "services/update";

    //$scope.$watch('files', function (newImg, oldImg) {
    //    _.forEach(newImg, function (img, key) {
    //        $scope.imageFiles.push(img);
    //    });
    //});

    $http.post(getTypeApi,{
        "servicesId" : $scope._id
    }).success( function(data){
        $scope.title = data.data[0].title;
        $scope.parentid = '' + data.data[0].parentId;
        //$scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));
        console.log($scope.parentid);
    });

    //$scope.updateType = function(){
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
    //            $http.post(typeUpdateApi, {
    //                    "servicesId" : $scope._id,
    //                    "title" : $scope.title,
    //                    "parentid" : parseInt($scope.parentid),
    //                    "image" : data.data[0]
    //                }
    //
    //            ).success(function(data){
    //
    //                    $state.transitionTo('typeManage')
    //                });
    //        });
    //
    //    } else {
    //        $scope.imageFiles = [];
    //        if(!$scope.title)
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
    //        if($scope.title && !specReg.test($scope.title))
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的二级分类！"});
    //        $http.post(typeUpdateApi, {
    //                "servicesId" : $scope._id,
    //                "title" : $scope.title,
    //                "parentid" : parseInt($scope.parentid)
    //            }
    //
    //        ).success(function(data){
    //
    //                $state.transitionTo('typeManage')
    //            });
    //    }
    //
    //};

    $scope.updateType = function(){
        if(!$scope.title)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
        if($scope.title && !specReg.test($scope.title))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的二级分类！"});
        $http.post(typeUpdateApi,{
            "servicesId" : $scope._id,
            "title" : $scope.title,
            "parentId" : parseInt($scope.parentid)
        }).success(function(){
            $state.transitionTo('typeManage')

        })
    }
});
