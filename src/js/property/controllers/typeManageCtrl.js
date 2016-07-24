/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_PropertyAdmin').controller('TypeManageController', function($scope,$http,$state,$stateParams,Upload,$rootScope){


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

                    var firstCategoryList = [];
                    $scope.firstCategoryList = _.filter($scope.currentTypeList,{parentId : 1});
                    console.log($scope.firstCategoryList);
                    var secondCategoryList = [];
                    $scope.secondCategoryList = _.filter($scope.currentTypeList,{parentId : 2});
                    console.log($scope.secondCategoryList);
                    var thirdCategoryList = [];
                    $scope.thirdCategoryList = _.filter($scope.currentTypeList,{parentId : 3});
                    console.log($scope.thirdCategoryList);
                    var fourthCategoryList = [];
                    $scope.fourthCategoryList = _.filter($scope.currentTypeList,{parentId : 4});
                    console.log($scope.fourthCategoryList);
                    //var fifthCategoryList = [];
                    //$scope.fifthCategoryList = _.filter($scope.currentTypeList,{parentId : 5});
                    //console.log($scope.fifthCategoryList);
                    var sixthCategoryList = [];
                    $scope.sixthCategoryList = _.filter($scope.currentTypeList,{parentId : 6});
                    console.log($scope.sixthCategoryList);

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
