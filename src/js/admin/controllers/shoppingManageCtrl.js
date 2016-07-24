/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('ShoppingManageController', function($scope,$http,$location,$rootScope,$state,$q){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 20;
    $scope.currentShoppingList = [];
    $scope.currentCategoryList = [];
    $scope.pageNum = null;
    $scope.allSelected = false;
    $scope.deleteAccount = null;
    $scope.hasDeleteAccounts = false;
    $scope.totalCount = null;
    $scope.isFav = null;
    $scope.product = {};
    $scope.sortType = -1;

    $scope.flag2 = X_context.flag2;

    var shoppingListApi = X_context.api + "product/list";
    var categoryListApi = X_context.api + "category/list";
    var deleteShoppingApi = X_context.api + "product/update";


    var categoryPromise = $http.post(categoryListApi,{
        storeId : X_context.storeId
        //category : 1,
    })
        .success(function(data){
            var currentCategoryList = data.data || [];
            $scope.currentCategoryList = currentCategoryList;
        });

    var vm = $scope.multiSelect = {};
    $scope.multiSelect.options = [];

    vm.selection = function() {
        return _.where($scope.multiSelect.options, {checked: true});
    }

    function getPageData(one){

        //$scope.allSelected = false;
        categoryPromise.then(function(){
            console.log($scope.currentCategoryList,$rootScope.product)
            if(one && $rootScope.product &&  ($rootScope.product.productName || $rootScope.product.category)){
                console.log('asd',$rootScope.product)
                $scope.product.name = $rootScope.product.productName
                    ? $rootScope.product.productName : "";
                $scope.category = _.find($scope.currentCategoryList,{id : ($rootScope.product.category
                    ? $rootScope.product.category : "")});
            }else{
                $rootScope.product = {};
            }

            $http.post(shoppingListApi,{
            storeId : X_context.storeId,
            //isMarketable : true,
            //category : 1,
            page : $scope.currentPage,
            pageSize : $scope.pageSize,
            productName :  $scope.product ? $scope.product.name : null,
            category : $scope.category ? $scope.category.id : null,
        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentShoppingList = data.data || [];
                $scope.currentShoppingList = currentShoppingList;
                if((one==false) && data.data.length == 0){
                    $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关商品，请正确输入信息后重试！"});
                    $scope.totalCount = 0;
                    $scope.pageNum = 0;
                }
                if(data.data.length != 0){
                    var isFav = data.data[0].isFav;
                    $scope.isFav = data.data[0].isFav;
                    var totalCount = data.data[0].totalCount;
                    $scope.totalCount = data.data[0].totalCount;
                    $scope.pageNum = (totalCount  && currentShoppingList.length >= 1)
                        ? Math.ceil(totalCount / $scope.pageSize)
                        : 1;
                    _.forEach($scope.currentShoppingList,function(product,index){
                        product.category = _.find($scope.currentCategoryList,{id : product.category});
                        product.link = '\/store'+'\/'+X_context.storeId+'\/store-product'+'\/'+product.id;
                        product.disableLink = true;
                    })
                }
                if((one==true) && data.data.length == 0){
                    $scope.totalCount = 0;
                    $scope.pageNum = 0;
                }

            });
        });
    }
    getPageData(true);

    $scope.goDetail = function(productId){
        $rootScope.product = {
            productName :  $scope.product ? $scope.product.name : null,
            category : $scope.category ? $scope.category.id : null
        };
        console.log('set',$rootScope.product)
        $state.transitionTo('shoppingUpdate',{productId:productId});
    }

    var shoppingPromise = getPageData();

    $scope.getPageData = getPageData;

    $scope.$watch('currentPage',function(){
        getPageData();
    });

    $scope.$watch('allSelected',function(){
        _.forEach($scope.currentShoppingList,function(item,key){
            item.deleteMark = $scope.allSelected;
        })
    });

    //$scope. $watch('currentAccountList',function(){
    //    $scope.deleteAccountsNum = _.filter($scope.currentAccountList,{deleteMark:true}).length;
    //})

    $scope.checkHasDeletedAccounts = function(){
        if( _.filter($scope.currentAccountList,{deleteMark:true}).length ==0){
            $scope.hasDeleteAccounts = false;
        }else{
            $scope.hasDeleteAccounts = true;
        }
    }

    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    }
    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    }

    $scope.sortName = function(){
        categoryPromise.then(function(){
            $http.post(shoppingListApi,{
                storeId : X_context.storeId,
                //isMarketable : true,
                //category : 1,
                page : $scope.currentPage,
                pageSize : $scope.pageSize,
                productName :  $scope.product ? $scope.product.name : null,
                category : $scope.category ? $scope.category.id : null,
                "nameSort" : $scope.sortType
            })
                .success(function(data){
                    $location.search({'page': $scope.currentPage});
                    var currentShoppingList = data.data || [];
                    $scope.currentShoppingList = currentShoppingList;
                    if(data.data.length == 0){
                        $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关商品，请正确输入信息后重试！"});
                        $scope.totalCount = 0;
                        $scope.pageNum = 0;
                    }
                    if(data.data.length != 0){
                        var isFav = data.data[0].isFav;
                        $scope.isFav = data.data[0].isFav;
                        var totalCount = data.data[0].totalCount;
                        $scope.totalCount = data.data[0].totalCount;
                        $scope.pageNum = (totalCount  && currentShoppingList.length >= 1)
                            ? Math.ceil(totalCount / $scope.pageSize)
                            : 1;
                        _.forEach($scope.currentShoppingList,function(product,index){
                            product.category = _.find($scope.currentCategoryList,{id : product.category});
                            product.link = '\/store'+'\/'+X_context.storeId+'\/store-product'+'\/'+product.id;
                            product.disableLink = true;
                        })
                    }

                });
        });

        $scope.sortType = -($scope.sortType);
    }

    $scope.sortId = function(){
        categoryPromise.then(function(){
            $http.post(shoppingListApi,{
                storeId : X_context.storeId,
                //isMarketable : true,
                //category : 1,
                page : $scope.currentPage,
                pageSize : $scope.pageSize,
                productName :  $scope.product ? $scope.product.name : null,
                category : $scope.category ? $scope.category.id : null,
                "idSort" : $scope.sortType
            })
                .success(function(data){
                    $location.search({'page': $scope.currentPage});
                    var currentShoppingList = data.data || [];
                    $scope.currentShoppingList = currentShoppingList;
                    if(data.data.length == 0){
                        $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关商品，请正确输入信息后重试！"});
                        $scope.totalCount = 0;
                        $scope.pageNum = 0;
                    }
                    if(data.data.length != 0){
                        var isFav = data.data[0].isFav;
                        $scope.isFav = data.data[0].isFav;
                        var totalCount = data.data[0].totalCount;
                        $scope.totalCount = data.data[0].totalCount;
                        $scope.pageNum = (totalCount  && currentShoppingList.length >= 1)
                            ? Math.ceil(totalCount / $scope.pageSize)
                            : 1;
                        _.forEach($scope.currentShoppingList,function(product,index){
                            product.category = _.find($scope.currentCategoryList,{id : product.category});
                            product.link = '\/store'+'\/'+X_context.storeId+'\/store-product'+'\/'+product.id;
                            product.disableLink = true;
                        })
                    }

                });
        });

        $scope.sortType = -($scope.sortType);
    }

    $scope.setDeleteAccount = function(id){
        $scope.deleteAccount = id;
    }

    $scope.setAddAccount = function(id){
        $scope.addAccount = id;
    }

    $scope.setDeleteProduct = function(id){
        $scope.deletePro = id;
    }

    $scope.deleteShopping = function(){
        if(!$scope.deleteAccount)return;
        $http.post(deleteShoppingApi,
            {
                "id": $scope.deleteAccount,
                "isMarket": "false"
            }
        ).success(function(data){
                getPageData();
            });
    };

    $scope.addShopping = function(){
        if(!$scope.addAccount)return;
        $http.post(deleteShoppingApi,
            {
                "id": $scope.addAccount,
                "isMarket": "true"
            }
        ).success(function(data){
                getPageData();
            });
    };

    $scope.deleteProduct = function(){
        if(!$scope.deletePro)return;
        $http.post(deleteShoppingApi,
            {
                "id": $scope.deletePro,
                "isDelete": true
            }
        ).success(function(data){
                getPageData();
            });
    };


    //$scope.setLink = function(id){
    //    _.find($scope.currentShoppingList,{id:id}).link =
    //    '\/store'+'\/'+X_context.storeId+'\/store-product'+'\/'+id;
    //};

        //$(document).ready(function(){
        //    $("#showthisButton").zclip({
        //        path: "js/ZeroClipboard.swf",
        //        copy: function () {
        //            return 1;
        //        }
        //    });
        //});

});
