/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('AddShoppingController', function($scope,$http,$state,$stateParams,Upload,$rootScope){
    $scope.currentCategoryList = [];
    $scope.name = "";
    $scope.sn = "";
    $scope.unit = "";
    $scope.category = "";
    $scope.marketPrice = "";
    $scope.price = "";
    $scope.amount = "";
    $scope.isFav = "true";
    $scope.image = "";
    $scope.specification = "";
    $scope.imageFiles = [];
    var one = false;
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.startDate = new Date(2015,0,0,8,0,0);
    $scope.endDate = new Date(2015,0,0,21,0,0);

    $scope.flag2 = X_context.flag2;

    var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9]|[\s])+)$/;
    var shoppingAdd = X_context.api + "product/add";
    var categoryListApi = X_context.api + "category/list";

    $http.post(categoryListApi,{
        storeId : X_context.storeId
        //category : 1,
    })
        .success(function(data){
            var currentCategoryList = data.data || [];
            $scope.currentCategoryList = currentCategoryList;
            $scope.category = $scope.currentCategoryList[0];
        });

    var vm = $scope.multiSelect = {};
    $scope.multiSelect.options = [];

    vm.selection = function() {
        return _.where($scope.multiSelect.options, {checked: true});
    }


    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.saveShopping = function(){
        var currentStart = new Date($scope.startDate);
        var currentEnd = new Date($scope.endDate);

        var startHour = currentStart.getHours();
        if(parseInt(startHour) < 10){
            startHour = '0' + startHour;
        }
        var startMinute = currentStart.getMinutes();
        if(parseInt(startMinute) < 10){
            startMinute = '0' + startMinute;
        }
        var endHour = currentEnd.getHours();
        if(parseInt(endHour) < 10){
            endHour = '0' + endHour;
        }
        var endMinute = currentEnd.getMinutes();
        if(parseInt(endMinute) < 10){
            endMinute = '0' + endMinute;
        }
        var startCurrentDate = startHour + ':' + startMinute;
        var endCurrentDate = endHour + ':' + endMinute;
        console.log(startCurrentDate,endCurrentDate);

        //var startCurrentDate = currentStart.getHours().toString() + ':' + currentStart.getMinutes().toString();
        //var endCurrentDate = currentEnd.getHours().toString() + ':' + currentEnd.getMinutes().toString();
        //console.log(startCurrentDate,endCurrentDate);
        if(!$scope.name || !$scope.sn || !$scope.isFav || !$scope.category || ($scope.flag2 == 0 && $scope.marketPrice != 0 && !$scope.marketPrice))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
        else if($scope.amount && (parseInt($scope.amount) != $scope.amount))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的库存！"});
        else if($scope.marketPrice && parseFloat($scope.marketPrice).toFixed(1) != $scope.marketPrice)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的价格，最多保留一位小数！"});
        else if($scope.point && (parseInt($scope.point) != $scope.point))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的积分！"});
        else if($scope.name && !specReg.test($scope.name))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的商品名称！"});
        else if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
            return $rootScope.$broadcast('alerts',{type:'danger',message:"售卖时间设置错误，请重新设置！"});
        else if($scope.imageFiles.length == 0)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
        else{
            if(one == true)return;
            one = true;
            console.log("oo",one);
                if ($scope.imageFiles && $scope.imageFiles.length > 0) {

                    Upload.upload({
                        url: X_context.api + 'img/add',
                        file: $scope.imageFiles,
                        fields: {
                            //"Authorization": X_context.authorization,
                            "productSn": $scope.sn
                        },
                        arrayKey : ""
                    }).progress(function (evt) {

                    }).success(function (data, status, headers, config) {
                        $scope.imageFiles = [];
                        $http.post(shoppingAdd,{

                                storeId : X_context.storeId,
                                "name" : $scope.name,
                                "sn" : $scope.sn,
                                //"unit" : $scope.unit,
                                "category" : $scope.category ? $scope.category.id : null,
                                "marketPrice" : ($scope.marketPrice == null) ? 0 : $scope.marketPrice,
                                "point" : $scope.point,
                                //"price" : $scope.price,
                                "amount" : ($scope.amount == null) ? 99999 : $scope.amount,
                                "isFav" : $scope.isFav,
                                "isDelete" : false,
                                "image" : data.data[0],
                                "startTime" : startCurrentDate,
                                "endTime" : endCurrentDate,
                                "spec" : $scope.specification ? $scope.specification : ' '

                            }
                        ).success(function(data){

                                $state.transitionTo('shoppingManage')
                            }).error(function(data){
                                $state.reload();
                                if(data.code == 500){
                                    return $rootScope.$broadcast('alerts',{type:'danger',message:"商品名称重复，请重新输入！"});
                                }
                            })
                    });

                } else {
                    $scope.imageFiles = [];
                }
        }


    };

    //$scope.$watch('marketPrice',function(newVal,oldVal){
    //    console.log(newVal,oldVal);
    //    if(newVal
    //        && (parseFloat(newVal) != parseFloat(oldVal))
    //        && (parseInt(newVal)!=parseFloat(newVal))){
    //        $scope.marketPrice = parseFloat(newVal).toFixed(1);
    //    }
    //})

    $scope.removeImg = function(index) {
        _.pullAt($scope.imageFiles, index);
    };
});

