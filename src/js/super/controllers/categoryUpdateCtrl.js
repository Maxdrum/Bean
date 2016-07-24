/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CategoryUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.title = "";
    $scope.parentid = "";

    $scope._id = $stateParams.servicesId;

    var getTypeApi = X_context.api + "services/list";
    var typeUpdateApi = X_context.api + "services/update";

    $http.post(getTypeApi,{
        "servicesId" : $scope._id
    }).success( function(data){
        $scope.title = data.data[0].title;
        $scope.parentid = '' + data.data[0].parentId;
        console.log($scope.parentid);
    });

    $scope.updateType = function(){
        if(!$scope.title)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
        $http.post(typeUpdateApi,{
            "servicesId" : $scope._id,
            "title" : $scope.title,
            "parentId" : parseInt($scope.parentid)
        }).success(function(){
            $state.transitionTo('categoryManage')

        })
    }

});

