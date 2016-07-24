/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('TypeManageController', function($scope,$http,$state,$rootScope){
    $scope.currentCategoryList = [];
    $scope.disableTypeManage =true;
    $scope.deleteCategory = null;
    var one = false;

    //var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9])+)$/;
    var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9]|[\s])+)$/;
    var categoryListApi = X_context.api + "category/listAll";
    var updateTypeApi = X_context.api + "category/update";
    var newTypeApi = X_context.api + "category/add";
    var deleteTypeApi = X_context.api + "category/update";

    function getPageData(){
        //$scope.allSelected = false;
        $http.post(categoryListApi,{
            storeId : X_context.storeId
            //category : 1,
            //page : $scope.currentPage,
            //pageSize : $scope.pageSize
        })
            .success(function(data){
                var currentCategoryList = data.data || [];
                $scope.currentCategoryList = currentCategoryList;
                var categoryList = [];
                $scope.categoryList = _.pluck($scope.currentCategoryList,'categoryName');
                console.log("category",$scope.categoryList);

            });
    }

    getPageData();

    $scope.update = function(categoryName,id,isShow,sort){
        console.log('id',id);
        console.log('categoryName',categoryName);
        console.log('isShow',isShow);
        console.log('sort',sort);
        if(!categoryName)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入分类！"});
        if(categoryName && !specReg.test(categoryName))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的分类！"});
        $http.post(updateTypeApi,{
            "id": id,
            storeId : X_context.storeId,
            "name" : categoryName,
            "isShow" : isShow,
            "sort" : sort
        }).success(function(){
            $rootScope.$broadcast('alerts',{type:'success',message:"修改成功！"});
            $state.reload();
        }).error(function(data){
            $state.reload();
            if(data.code == 500){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"已有此分类，请重新输入！"});
            }
        })
    }

    $scope.newType = function(){
        if(!$scope.data || !$scope.data.categoryName || !$scope.data.isShow)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入类别及是否显示！"});
        else if($scope.data && $scope.data.categoryName && !specReg.test($scope.data.categoryName))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的分类！"});
        else if($scope.categoryList.indexOf($scope.data.categoryName) != -1)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"已有此分类，请重新输入！"});
        else{
            if(one == true)return;
            one = true;
                $http.post(newTypeApi,{
                    storeId : X_context.storeId,
                    "name" : $scope.data.categoryName,
                    "isShow" : $scope.data.isShow

                }).success(function(){
                    getPageData();
                }).error(function(data){
                    $state.reload();
                    getPageData();
                    if(data.code == 500){
                        return $rootScope.$broadcast('alerts',{type:'danger',message:"已有此分类，请重新输入！"});
                    }
                })
        }

    }

    $scope.setDeleteType = function(id){
        $scope.deleteCategory = id;
    }
    $scope.deleteType = function(id){
        $http.post(deleteTypeApi,
            {
                storeId : X_context.storeId,
                "id": $scope.deleteCategory,
                "isDel": "true"
            }
        ).success(function(data){
                getPageData();
            });
    };
});
