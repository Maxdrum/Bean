/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ShopUpdateController', function($scope,$http,$state,$stateParams,Upload,$rootScope,$q){
    $scope.storeName = "";
    $scope.phone = "";
    $scope.flag1 = "";
    $scope.worktime = "";
    $scope.freight = "";
    $scope.freightfee = "";
    $scope.introduce = "";
    $scope.propa = "";
    $scope.printSn = "";
    $scope.printKey = "";
    $scope.image = "";
    $scope.imageFiles = [];
    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.startDate = new Date(2015,0,0,8,0,0);
    $scope.endDate = new Date(2015,0,0,21,0,0);


    $scope.id = $stateParams.shopId;
    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getShopApi= X_context.apiForApp + "store/list";
    var shopUpdateApi = X_context.apiForApp + "store/update";
    console.log( $scope.id);

    $http.post(getShopApi,{
        storeId: $scope.id
        //storeId : X_context.storeId
    }).success( function(data){
        $scope.storeName = data.data.detail[0].storeName;
        $scope.telephone = data.data.detail[0].telephone;
        $scope.flag1 = data.data.detail[0].flag1;
        //$scope.worktime = data.data[0].worktime;
        $scope.startTime = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? data.data.detail[0].workTime.split("~")[0] : "08:00";
        $scope.startTimeHour = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? $scope.startTime.split(":")[0] : 8;
        $scope.startTimeMinute = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? $scope.startTime.split(":")[1] : 0;
        $scope.endTime = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? data.data.detail[0].workTime.split("~")[1] : "21:00";
        $scope.endTimeHour = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? $scope.endTime.split(":")[0] : 21;
        $scope.endTimeMinute = (data.data && data.data.detail[0] && data.data.detail[0].workTime) ? $scope.endTime.split(":")[1] : 0;
        //$scope.startFinal = "2016,1,18" + " " + $scope.startTime;
        //$scope.endFinal = "2016,1,18" + " " + $scope.endTime;
        //console.log($scope.startFinal);
        $scope.startDate = new Date(2016,2,8,$scope.startTimeHour,$scope.startTimeMinute,0);
        $scope.endDate = new Date(2016,2,8,$scope.endTimeHour,$scope.endTimeMinute,0);
        console.log($scope.startDate,$scope.endDate);
        $scope.freight = data.data.detail[0].freight;
        $scope.freightfee = data.data.detail[0].freightfee;
        $scope.introduce = data.data.detail[0].introduce;
        $scope.contactor = data.data.detail[0].contactor;
        $scope.propa = data.data.detail[0].propaganda;
        $scope.printSn = data.data.detail[0].printSn;
        $scope.printKey = data.data.detail[0].printKey;
        $scope.image = X_context.devHost + (data.data.detail[0].listImage + '?' + Math.floor(Math.random()*100000));
        $scope.imageApp = X_context.devHost + (data.data.detail[0].listAppImage + '?' + Math.floor(Math.random()*100000));
        //$scope.account = data.data[0].userDao[0].loginName;
        $scope.account = _.find(data.data.detail[0].userDao,{"role" : 1}) ? _.find(data.data.detail[0].userDao,{"role" : 1}).loginName : "";
    });

    //$scope.$watch('files', function (newImg, oldImg) {
    //    _.forEach(newImg, function (img, key) {
    //        $scope.imageFiles.push(img);
    //    });
    //});

    $scope.update = function(){
        if(parseInt($scope.freight) != $scope.freight)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入起送价！"});
        if(parseInt($scope.freightfee) != $scope.freightfee)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入运费！"});
        if($scope.telephone && !phoneReg.test($scope.telephone))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
            return $rootScope.$broadcast('alerts',{type:'danger',message:"营业时间设置错误，请重新设置！"});
        if(!$scope.storeName || !$scope.telephone || !$scope.contactor)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});

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

        var listImgPromise = Promise.resolve();
        var appImgPromise = Promise.resolve();
        if ($scope.files && $scope.files.length > 0){
            listImgPromise = Upload.upload({
                url: X_context.api + 'img/addStoreListImg',
                file: $scope.files,
                fields: {
                    "storeId": $scope.id
                },
                arrayKey : ""
            })
        }
        if ($scope.files2 && $scope.files2.length > 0){
            appImgPromise = Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.files2,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 317,
                    "height": 214
                },
                arrayKey : ""
            })
        }

        $q.all([listImgPromise,appImgPromise]).then(function(datas){
            console.log(datas);
            $http.post(shopUpdateApi, {
                    storeId: $scope.id,
                    "storeName" : $scope.storeName,
                    "phone" : $scope.telephone,
                    "isEnable" : $scope.flag1,
                    "contactor" : $scope.contactor,
                    "worktime" : startCurrentDate + "~" + endCurrentDate,
                    "freight" : $scope.freight,
                    "freightfee" : $scope.freightfee,
                    "propa" : $scope.propa,
                    "printSn" : $scope.printSn,
                    "printKey" : $scope.printKey,
                    "introduce" : $scope.introduce ? $scope.introduce : ' ',
                    "listImage" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
                    "listAppImage" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null

                }

            ).success(function(data){

                    $rootScope.$broadcast('alerts',{type:'success',message:"店铺修改成功！"});
                    $state.reload();
                });
        })

    };

    //$scope.update = function(){
    //
    //    var currentStart = new Date($scope.startDate);
    //    var currentEnd = new Date($scope.endDate);
    //    var startHour = currentStart.getHours();
    //    if(parseInt(startHour) < 10){
    //        startHour = '0' + startHour;
    //    }
    //    var startMinute = currentStart.getMinutes();
    //    if(parseInt(startMinute) < 10){
    //        startMinute = '0' + startMinute;
    //    }
    //    var endHour = currentEnd.getHours();
    //    if(parseInt(endHour) < 10){
    //        endHour = '0' + endHour;
    //    }
    //    var endMinute = currentEnd.getMinutes();
    //    if(parseInt(endMinute) < 10){
    //        endMinute = '0' + endMinute;
    //    }
    //    var startCurrentDate = startHour + ':' + startMinute;
    //    var endCurrentDate = endHour + ':' + endMinute;
    //    console.log(startCurrentDate,endCurrentDate);
    //
    //    if ($scope.imageFiles && $scope.imageFiles.length > 0) {
    //
    //        Upload.upload({
    //            url: X_context.api + 'img/addStoreListImg',
    //            file: $scope.imageFiles,
    //            fields: {
    //                //"Authorization": X_context.authorization,
    //                "storeId": $scope.id
    //            },
    //            arrayKey : ""
    //        }).progress(function (evt) {
    //
    //        }).success(function (data, status, headers, config) {
    //            $scope.imageFiles = [];
    //            if(parseInt($scope.freight) != $scope.freight)
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入起送价！"});
    //            if(parseInt($scope.freightfee) != $scope.freightfee)
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入运费！"});
    //            if($scope.telephone && !phoneReg.test($scope.telephone))
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //            if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"营业时间设置错误，请重新设置！"});
    //            //if(parseInt($scope.telephone) != $scope.telephone)
    //            //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //            //if($scope.telephone.length == 9 || $scope.telephone.length == 10)
    //            //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
    //            if(!$scope.storeName || !$scope.telephone || !$scope.contactor)
    //                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
    //            $http.post(shopUpdateApi, {
    //                    //"id":$scope.id,
    //                    storeId: $scope.id,
    //                    "storeName" : $scope.storeName,
    //                    "phone" : $scope.telephone,
    //                    "isEnable" : $scope.flag1,
    //                    "contactor" : $scope.contactor,
    //                    "worktime" : startCurrentDate + "~" + endCurrentDate,
    //                    "freight" : $scope.freight,
    //                    "freightfee" : $scope.freightfee,
    //                    "propa" : $scope.propa,
    //                    "printSn" : $scope.printSn,
    //                    "printKey" : $scope.printKey,
    //                    "listImage" : data.data[0],
    //                    "introduce" : $scope.introduce ? $scope.introduce : ' '
    //
    //                }
    //
    //            ).success(function(data){
    //                    $rootScope.$broadcast('alerts',{type:'success',message:"店铺修改成功！"});
    //                    $state.reload();
    //                });
    //        });
    //
    //    } else {
    //        $scope.imageFiles = [];
    //        if(parseInt($scope.freight) != $scope.freight)
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入起送价！"});
    //        if(parseInt($scope.freightfee) != $scope.freightfee)
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入运费！"});
    //        if($scope.telephone && !phoneReg.test($scope.telephone))
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //        if((new Date($scope.startDate)).getTime() >= (new Date($scope.endDate)).getTime())
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"营业时间设置错误，请重新设置！"});
    //        //if(parseInt($scope.telephone) != $scope.telephone)
    //        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //        //if($scope.telephone.length == 9 || $scope.telephone.length == 10)
    //        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
    //        if(!$scope.storeName || !$scope.telephone || !$scope.contactor)
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
    //        $http.post(shopUpdateApi, {
    //                //"id":$scope.id,
    //                storeId: $scope.id,
    //                "storeName" : $scope.storeName,
    //                "phone" : $scope.telephone,
    //                "isEnable" : $scope.flag1,
    //                "contactor" : $scope.contactor,
    //                "worktime" : startCurrentDate + "~" + endCurrentDate,
    //                "freight" : $scope.freight,
    //                "freightfee" : $scope.freightfee,
    //                "propa" : $scope.propa,
    //                "printSn" : $scope.printSn,
    //                "printKey" : $scope.printKey,
    //                //"listImage" : X_context.imgHost + data.data[0],
    //                "introduce" : $scope.introduce ? $scope.introduce : ' '
    //
    //            }
    //
    //        ).success(function(data){
    //                $rootScope.$broadcast('alerts',{type:'success',message:"店铺修改成功！"});
    //                $state.reload();
    //            });
    //    }
    //
    //};

});



