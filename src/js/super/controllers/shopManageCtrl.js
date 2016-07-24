/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ShopManageController', function($scope,$http,$state,$rootScope){
    $scope.currentShopList = [];
    $scope.deleteStore = null;
    $scope.openStore = null;

    var shopListApi = X_context.api + "store/list";
    var closeShopApi = X_context.api + "store/update";
    var openShopApi = X_context.api + "store/update";


        function getPageData(){
        $http.post(shopListApi,{})
            .success(function(data){
                $scope.currentShopList = data.data || [];
                var flag1 = data.data[0].flag1;
                $scope.flag1 = data.data[0].flag1;
                _.forEach($scope.currentShopList,function(shop,index){
                    shop.link = '\/store'+'\/'+shop.id;
                    shop.disableLink = true;
                })

            });
    }
    getPageData();

    $scope.setDeleteShop = function(id){
        $scope.deleteStore = id;
    }
    $scope.closeShop = function(id){
        $http.post(closeShopApi,
            {
                storeId : $scope.deleteStore,
                //"id": $scope.deleteStore,
                "isEnable": "0"
            }
        ).success(function(data){
                getPageData();
            });
    };

    $scope.setOpenShop = function(id){
        $scope.openStore = id;
    }
    $scope.openShop = function(id){
        $http.post(openShopApi,
            {
                storeId : $scope.openStore,
                //"id": $scope.deleteStore,
                "isEnable": "1"
            }
        ).success(function(data){
                getPageData();
            });
    };

    // Model to JSON for demo purpose
    $scope.$watch('currentShopList', function(list,old) {
        if(old.length <= 0 || list.length  == old.length+1 || list.length <= 0)return;
        let out = [];
        _.forEach(list,function(item,index){
            out.push({
                storeId : item.id,
                sort : index
            })
        });
        $http.post(X_context.api + 'store/updateSort',{
            sortArray : out
        }).success(function(){

        })

    },true);


});

