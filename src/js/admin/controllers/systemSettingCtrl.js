/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('SystemSettingController', function($scope,$http,$state,$stateParams,Upload,$rootScope){
    $scope.freight = "";
    $scope.freightfee = "";
    $scope.address = "";
    $scope.scope = "";
    $scope.worktime = "";
    $scope.telephone = "";
    $scope.introduce = "";
    $scope.wechatId = "";
    $scope.workStatus = "";
    $scope.image = "";
    $scope.imageFiles = [];
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.startDate = new Date(2015,0,0,8,0,0);
    $scope.endDate = new Date(2015,0,0,21,0,0);
    console.log($scope.startDate);


    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getShopApi= X_context.api + "store/list";
    var shopUpdateApi = X_context.api + "store/update";

    $scope.$watch('files', function (newImg, oldImg) {
        _.forEach(newImg, function (img, key) {
            $scope.imageFiles.push(img);
        });
    });



    $http.post(getShopApi,{

        storeId : X_context.storeId
    }).success( function(data){
        $scope.telephone = data.data[0].telephone;
        $scope.scope = data.data[0].scope;
        $scope.address = data.data[0].address;
        //$scope.worktime = data.data[0].worktime;
        $scope.startTime = (data.data[0] && data.data[0].worktime) ? data.data[0].worktime.split("~")[0] : "08:00";
        $scope.startTimeHour = (data.data[0] && data.data[0].worktime) ? $scope.startTime.split(":")[0] : 8;
        $scope.startTimeMinute = (data.data[0] && data.data[0].worktime) ? $scope.startTime.split(":")[1] : 0;
        $scope.endTime = (data.data[0] && data.data[0].worktime) ? data.data[0].worktime.split("~")[1] : "21:00";
        $scope.endTimeHour = (data.data[0] && data.data[0].worktime) ? $scope.endTime.split(":")[0] : 21;
        $scope.endTimeMinute = (data.data[0] && data.data[0].worktime) ? $scope.endTime.split(":")[1] : 0;
        //$scope.startFinal = "2016,1,18" + " " + $scope.startTime;
        //$scope.endFinal = "2016,1,18" + " " + $scope.endTime;
        //console.log($scope.startFinal);
        $scope.startDate = new Date(2016,2,8,$scope.startTimeHour,$scope.startTimeMinute,0);
        $scope.endDate = new Date(2016,2,8,$scope.endTimeHour,$scope.endTimeMinute,0);
        console.log($scope.startDate);
        $scope.freight = data.data[0].freight;
        $scope.freightfee = data.data[0].freightfee;
        $scope.introduce = data.data[0].introduce;
        $scope.wechatId = data.data[0].wechatId;
        $scope.workStatus = data.data[0].flag1;
        $scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));
    });

    $scope.update = function(){
        var currentStart = new Date($scope.startDate);
        var currentEnd = new Date($scope.endDate);
        var startCurrentDate = currentStart.getHours().toString() + ':' + currentStart.getMinutes().toString();
        var endCurrentDate = currentEnd.getHours().toString() + ':' + currentEnd.getMinutes().toString();
        console.log(startCurrentDate,endCurrentDate);
        if ($scope.imageFiles && $scope.imageFiles.length > 0) {

            Upload.upload({
                url: X_context.api + 'img/addStoreImg',
                file: $scope.imageFiles,
                fields: {
                    //"Authorization": X_context.authorization,
                    "storeId": X_context.storeId
                },
                arrayKey : ""
            }).progress(function (evt) {

            }).success(function (data, status, headers, config) {
                $scope.imageFiles = [];
                //if(parseInt($scope.telephone) != $scope.telephone)
                //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
                //if($scope.telephone.length == 9 || $scope.telephone.length == 10)
                //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
                if($scope.telephone && !phoneReg.test($scope.telephone))
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
                if(parseInt($scope.freight) != $scope.freight)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入起送价！"});
                if(parseInt($scope.freightfee) != $scope.freightfee)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入运费！"});
                if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"营业时间设置错误，请重新设置！"});
                if(!$scope.scope || !$scope.telephone || !$scope.address)
                    return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
                $http.post(shopUpdateApi, {
                        storeId : X_context.storeId,
                        "scope" : $scope.scope,
                        "phone" : $scope.telephone,
                        "address" : $scope.address,
                        //"worktime" : $scope.worktime,
                        "worktime" : startCurrentDate + "~" + endCurrentDate,
                        "freight" : parseInt($scope.freight),
                        "freightfee" : parseInt($scope.freightfee),
                        "image" : data.data[0],
                        "introduce" : $scope.introduce ? $scope.introduce : ' ',
                        "wechatId" : $scope.wechatId ? $scope.wechatId : ' ',
                        "isEnable" : $scope.workStatus

                    }

                ).success(function(data){

                        $rootScope.$broadcast('alerts',{type:'success',message:"系统设置成功！"});
                        $state.reload();
                    });
            });

        } else {
            $scope.imageFiles = [];
            //if(parseInt($scope.telephone) != $scope.telephone)
            //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
            //if($scope.telephone.length == 9 || $scope.telephone.length == 10)
            //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
            if($scope.telephone && !phoneReg.test($scope.telephone))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
            if(parseInt($scope.freight) != $scope.freight)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入起送价！"});
            if(parseInt($scope.freightfee) != $scope.freightfee)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入运费！"});
            if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
                return $rootScope.$broadcast('alerts',{type:'danger',message:"营业时间设置错误，请重新设置！"});
            if(!$scope.scope || !$scope.telephone || !$scope.address)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            $http.post(shopUpdateApi, {
                    storeId : X_context.storeId,
                    "scope" : $scope.scope,
                    "phone" : $scope.telephone,
                    "address" : $scope.address,
                    //"worktime" : $scope.worktime,
                    "worktime" : startCurrentDate + "~" + endCurrentDate,
                    "freight" : parseInt($scope.freight),
                    "freightfee" : parseInt($scope.freightfee),
                    "introduce" : $scope.introduce ? $scope.introduce : ' ',
                    "wechatId" : $scope.wechatId ? $scope.wechatId : ' ',
                    "isEnable" : $scope.workStatus

                }

            ).success(function(data){

                    $rootScope.$broadcast('alerts',{type:'success',message:"系统设置成功！"});
                    $state.reload();
                });
        }

    };

    $scope.removeImg = function(index) {
        _.pullAt($scope.imageFiles, index);
    };

});
