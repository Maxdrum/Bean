/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CategoryManageController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.currentTypeList = [];
    $scope.currentCategoryList = [];
    $scope.deleteAccount = null;

    var typeListApi = X_context.api + "services/list";
    var deleteTypeApi = X_context.api + "services/delete";

    function getPageData(){

        $http.post(typeListApi,{
            //storeId : X_context.storeId
        })
            .success(function(data){
                var currentTypeList = data.data || [];
                $scope.currentTypeList = currentTypeList;
                var fifthCategoryList = [];
                $scope.fifthCategoryList = _.filter($scope.currentTypeList,{parentId : 5});
                console.log($scope.fifthCategoryList);

            });

    }
    getPageData();


    $scope.setDeleteAccount = function(id){
        $scope.deleteAccount = id;
    }


    $scope.deleteType = function(){
        $http.post(deleteTypeApi, {

                "servicesId": $scope.deleteAccount
            }
        ).success(function(data){
                getPageData();
            });
    };

});

