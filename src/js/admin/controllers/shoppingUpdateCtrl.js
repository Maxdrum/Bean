/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('ShoppingUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope){
    $scope.currentCategoryList = [];
    $scope.category = {};
    $scope.name = "";
    $scope.sn = "";
    $scope.category = "";
    $scope.marketPrice = "";
    $scope.amount = "";
    $scope.isFav = "";
    $scope.image = "";
    $scope.specification = "";
    $scope.imageFiles = [];
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.startDate = new Date(2015,0,0,8,0,0);
    $scope.endDate = new Date(2015,0,0,21,0,0);

    $scope.flag2 = X_context.flag2;


    $scope.id = $stateParams.productId;
    var specReg = /^(([\u4e00-\u9fa5]|[a-zA-Z0-9]|[\s])+)$/;
    var getProductApi= X_context.api + "product/list";
    var categoryListApi = X_context.api + "category/list";
    var productUpdateApi = X_context.api + "product/update";
    console.log( $scope.id);

    var catePromise = $http.post(categoryListApi,{
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

    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });

    $scope.goBack = function(){
        window.history.back();
    };

    catePromise.then(function(){
        $http.post(getProductApi,{
            id: $scope.id,
            storeId : X_context.storeId
        }).success( function(data){
            $scope.name = data.data[0].name;
            $scope.sn = data.data[0].sn;
            $scope.category = _.find($scope.currentCategoryList,{id : data.data[0].category});
            $scope.marketPrice = data.data[0].marketPrice;
            $scope.point = data.data[0].point;
            $scope.amount = data.data[0].amount;
            $scope.isFav = data.data[0].isFav;
            $scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));
            $scope.specification = data.data[0].specification;
            $scope.startTime = (data.data[0] && data.data[0].startTime) ? data.data[0].startTime : "08:00";
            $scope.startTimeHour = (data.data[0] && data.data[0].startTime) ? $scope.startTime.split(":")[0] : 8;
            $scope.startTimeMinute = (data.data[0] && data.data[0].startTime) ? $scope.startTime.split(":")[1] : 0;
            $scope.endTime = (data.data[0] && data.data[0].endTime) ? data.data[0].endTime : "21:00";
            $scope.endTimeHour = (data.data[0] && data.data[0].endTime) ? $scope.endTime.split(":")[0] : 21;
            $scope.endTimeMinute = (data.data[0] && data.data[0].endTime) ? $scope.endTime.split(":")[1] : 0;
            //$scope.startFinal = "2016,1,18" + " " + $scope.startTime;
            //$scope.endFinal = "2016,1,18" + " " + $scope.endTime;
            $scope.startDate = new Date(2016,2,8,$scope.startTimeHour,$scope.startTimeMinute,0);
            $scope.endDate = new Date(2016,2,8,$scope.endTimeHour,$scope.endTimeMinute,0);
        });
    });
    $scope.update = function(){
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
                console.log($scope.imageFiles);
                $scope.imageFiles = [];
                if(!$scope.name || !$scope.sn || !$scope.isFav || !$scope.category || ($scope.flag2 == 0 && $scope.marketPrice != 0 && !$scope.marketPrice))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                if($scope.amount && (parseInt($scope.amount) != $scope.amount))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的库存！"});
                if($scope.marketPrice && parseFloat($scope.marketPrice).toFixed(1) != $scope.marketPrice)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的价格，最多保留一位小数！"});
                if($scope.point && (parseInt($scope.point) != $scope.point))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的积分！"});
                if($scope.name && !specReg.test($scope.name))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的商品名称！"});
                if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"售卖时间设置错误，请重新设置！"});
                $http.post(productUpdateApi, {
                        "id":$scope.id,
                        storeId : X_context.storeId,
                        "name" : $scope.name,
                        "sn" : $scope.sn,
                        "category" : $scope.category ? $scope.category.id : null,
                        "marketPrice" : ($scope.marketPrice == null) ? 0 : $scope.marketPrice,
                        "point" : ($scope.point == null) ? 0 : $scope.point,
                        "amount" : ($scope.amount == null) ? 99999 : $scope.amount,
                        "isFav" : $scope.isFav,
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
            if(!$scope.name || !$scope.sn || !$scope.isFav || !$scope.category || ($scope.flag2 == 0 && $scope.marketPrice != 0 && !$scope.marketPrice))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            //console.log(parseInt($scope.amount),$scope.amount);
            if($scope.amount && (parseInt($scope.amount) != $scope.amount))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的库存！"});
            if($scope.marketPrice && parseFloat($scope.marketPrice).toFixed(1) != $scope.marketPrice)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的价格，最多保留一位小数！"});
            if($scope.point && (parseInt($scope.point) != $scope.point))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的积分！"});
            if($scope.name && !specReg.test($scope.name))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"不能输入特殊字符，请输入正确的商品名称！"});
            if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
                return $rootScope.$broadcast('alerts',{type:'danger',message:"售卖时间设置错误，请重新设置！"});
            $http.post(productUpdateApi, {
                    "id":$scope.id,
                    storeId : X_context.storeId,
                    "name" : $scope.name,
                    "sn" : $scope.sn,
                    "category" : $scope.category ? $scope.category.id : null,
                    "marketPrice" : ($scope.marketPrice == null) ? 0 : $scope.marketPrice,
                    "point" : ($scope.point == null) ? 0 : $scope.point,
                    "amount" : ($scope.amount == null) ? 99999 : $scope.amount,
                    "isFav" : $scope.isFav,
                    //"image" : X_context.imgHost + data.data[0],
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
    
    $scope.goBack = function(){
        $state.go('shoppingManage')
    }

});
