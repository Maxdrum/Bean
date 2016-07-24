/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ActivityUpdateController', function($scope,$http,$state,$stateParams,Upload,$location,$rootScope,$q){

    $scope.name = "";
    $scope.sn = "";
    $scope.category = "";
    $scope.marketPrice = "";
    $scope.amount = "";
    $scope.isFav = "";
    $scope.image = "";
    $scope.specification = "";

    $scope.id = $stateParams.activityId;

    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getActivityListApi= X_context.apiForApp + "activity/getActivityDetail";
    var activityUpdateApi = X_context.apiForApp + "activity/update";
    console.log( $scope.id);

    $scope.goBack = function(){
        window.history.back();
    };

        var initPromise = $http.post(getActivityListApi,{
            activityId: $scope.id

        }).success( function(data){
            $scope.title = data.data.list[0].title;
            $scope.subtitle = data.data.list[0].subTitle;
            $scope.startDate = new Date(data.data.list[0].startDate);//(new Date(data.data[0].startdate)).getFullYear() + '/' + ((new Date(data.data[0].startdate)).getMonth() + 1) + '/' + (new Date(data.data[0].startdate)).getDate();
            $scope.endDate = new Date(data.data.list[0].endDate);
            $scope.image = X_context.devHost + (data.data.list[0].imageUrl + '?' + Math.floor(Math.random()*100000));
            $scope.banner = X_context.devHost + (data.data.list[0].banner + '?' + Math.floor(Math.random()*100000));
            $scope.bannerApp = X_context.devHost + (data.data.list[0].appBanner + '?' + Math.floor(Math.random()*100000));
            $scope.location = data.data.list[0].location;
            $scope.mobile = data.data.list[0].mobile;
            $scope.price = data.data.list[0].price;
            $scope.point = data.data.list[0].point;
            $scope.content = data.data.list[0].content;
            $scope.showBanner = (data.data.list[0].showBanner == 1) ? true : false;
            $scope.showAppBanner = (data.data.list[0].showAppBanner == 1) ? true : false;
        });

    //console.log("ooooo",$scope.startDate);

    $scope.update = function(){
        if(!$scope.title || !$scope.subtitle || !$scope.startDate || !$scope.endDate || !$scope.location || !$scope.mobile)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
        if($scope.mobile && !phoneReg.test($scope.mobile))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        //if(parseInt($scope.mobile) != $scope.mobile)
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        //if($scope.mobile.length == 9 || $scope.mobile.length == 10)
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});

        var listImgPromise = Promise.resolve();
        var bannerImgPromise = Promise.resolve();
        var bannerAppImgPromise = Promise.resolve();
        if ($scope.files && $scope.files.length > 0){
            listImgPromise = Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.files,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 100,
                    "height": 100
                },
                arrayKey : ""
            })
        }
        if ($scope.files2 && $scope.files2.length > 0){
            bannerImgPromise = Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.files2,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 640,
                    "height": 240
                },
                arrayKey : ""
            })
        }
        if ($scope.files3 && $scope.files3.length > 0){
            bannerAppImgPromise = Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.files3,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 640,
                    "height": 450
                },
                arrayKey : ""
            })
        }

        $q.all([listImgPromise,bannerImgPromise,bannerAppImgPromise]).then(function(datas){
            console.log(datas);
            var currentStart = new Date($scope.startDate);
            var currentEnd = new Date($scope.endDate);
            var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
            var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
            console.log(currentStart,startCurrentDate);
            $http.post(activityUpdateApi, {
                    "activityId":$scope.id,
                    "title" : $scope.title,
                    "subTitle" : $scope.subtitle,
                    "startDate" : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
                    "endDate" : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
                    "location" : $scope.location,
                    "mobile" : $scope.mobile,
                    "content" : $scope.quill.getHTML(),
                    "imageUrl" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
                    "banner" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null,
                    "appBanner" : ($scope.files3 && $scope.files3.length > 0) ? datas[2].data.data[0] : null,
                    "showBanner" : ($scope.showBanner == true) ? 1 : 0,
                    "showAppBanner" : ($scope.showAppBanner == true) ? 1 : 0
                }

            ).success(function(data){

                    $state.transitionTo('activityManage')
                });
        })

    };

    //old
    //if ($scope.files && $scope.files.length > 0
    //&& $scope.files2 && $scope.files2.length > 0) {
    //
    //    Upload.upload({
    //        url: X_context.api + 'img/addCommonImg',
    //        file: $scope.files,
    //        fields: {
    //            //"Authorization": X_context.authorization,
    //            "storeId": X_context.storeId
    //        }
    //    }).success(function(){
    //        Upload.upload({
    //            url: X_context.api + 'img/addCommonImg',
    //            file: $scope.files2,
    //            fields: {
    //                //"Authorization": X_context.authorization,
    //                "storeId": X_context.storeId
    //            }
    //        })
    //    })
    //        .success(function (data, status, headers, config) {
    //        $scope.files = [];
    //        $scope.files2 = [];
    //        if(!$scope.title || !$scope.subtitle || !$scope.startDate || !$scope.endDate || !$scope.location || !$scope.mobile)
    //            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
    //        if(parseInt($scope.mobile) != $scope.mobile) return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //        var currentStart = new Date($scope.startDate);
    //        var currentEnd = new Date($scope.endDate);
    //        var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
    //        var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
    //        console.log(currentStart,startCurrentDate);
    //        $http.post(activityUpdateApi, {
    //                "activityId":$scope.id,
    //                "title" : $scope.title,
    //                "subtitle" : $scope.subtitle,
    //                "startdate" : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
    //                "enddate" : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
    //                "location" : $scope.location,
    //                "mobile" : $scope.mobile,
    //                "image" : data.data[0],
    //                "banner" : data.data[0],
    //                "showBanner" : $scope.showBanner
    //            }
    //
    //        ).success(function(data){
    //
    //                $state.transitionTo('activityManage')
    //            });
    //    });

    //} else {
    //    $scope.files = [];
    //    $scope.files2 = [];
    //    if(!$scope.title || !$scope.subtitle || !$scope.startDate || !$scope.endDate || !$scope.location || !$scope.mobile)
    //        return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
    //    if(parseInt($scope.mobile) != $scope.mobile) return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
    //    var currentStart = new Date($scope.startDate);
    //    var currentEnd = new Date($scope.endDate);
    //    var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
    //    var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
    //    console.log(currentStart,startCurrentDate);
    //    $http.post(activityUpdateApi, {
    //            "activityId":$scope.id,
    //            "title" : $scope.title,
    //            "subtitle" : $scope.subtitle,
    //            "startdate" : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
    //            "enddate" : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
    //            "location" : $scope.location,
    //            "mobile" : $scope.mobile,
    //            //"image" : data.data[0],
    //            "showBanner" : $scope.showBanner
    //        }
    //
    //    ).success(function(data){
    //
    //            $state.transitionTo('activityManage')
    //        });
    //}



    //date
    //$scope.today = function() {
    //    $scope.endDate = new Date();
    //};
    //$scope.today();
    //
    //$scope.former = function() {
    //    $scope.startDate = new Date((new Date()- 30*24*60*60*1000));
    //};
    //$scope.former();

    $scope.clear = function () {
        $scope.startDate = null;
        $scope.endDate = null;
    };

    // Disable weekend selection
    //$scope.disabled = function(date, mode) {
    //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    //};

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openStart = function($event) {
        $scope.status.openedStart = true;
    };

    $scope.openEnd = function($event) {
        $scope.status.openedEnd = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        openedStart : false,
        openedEnd : false
    };

    //quill editor
    $scope.$$postDigest(function(){
        initPromise.then(function(){
            $scope.quill = new Quill('#editor-container', {
                modules: { toolbar: '#formatting-container' ,
                    'image-tooltip': true,
                    'link-tooltip': true
                },
                theme: 'snow'
            });
            $scope.quill.on('selection-change', function(range) {
                console.log('selection-change', range)
            });
            $scope.quill.on('text-change', function(delta, source) {
                console.log('text-change', delta, source)
                console.log($scope.quill.getHTML());
            });
            $scope.quill.setHTML($scope.content);
        })
    });



    $scope.$watch('innerFile', function () {
        console.log($scope.innerFile);
        if ($scope.innerFile != null) {
            $scope.fileInner = [$scope.innerFile];
            Upload.upload({
                url: X_context.api + 'img/addCommonImg',
                file: $scope.innerFile,
                fields: {
                    //"Authorization": X_context.authorization,
                    "width": 640
                    //"height": 300
                },
                arrayKey : ""
            })
                .success(function (data) {
                    //var range = $scope.quill.getSelection();
                    $scope.quill.insertEmbed($scope.quill.getLength(), 'image', X_context.devHost + (data.data[0] + '?' + Math.floor(Math.random()*100000)));
            });
        }

    });
});

