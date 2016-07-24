/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CategoryAddController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.title = "";
    $scope.parentid = "5";
    var one = false;

    var typeAddApi = X_context.api + "services/add";


    $scope.saveType = function(){
        if(!$scope.title)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入二级分类名称！"});
        else{
            if(one == true)return;
            one = true;
                $http.post(typeAddApi,{
                    "title" : $scope.title,
                    "parentId" : $scope.parentid
                }).success(function(){
                    $state.transitionTo('categoryManage')

                })
        }

    }

});


