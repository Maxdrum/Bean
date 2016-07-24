/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ActivityAddController', function($scope,$http,$state,$stateParams,Upload,$location,$rootScope,$q){

    $scope.paytype = 0;
    var one = false;

    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var addActivityApi = X_context.apiForApp + "activity/add";


    $scope.addActivity = function(){
        if((!$scope.files || $scope.files.length == 0) || (!$scope.files2 || $scope.files2.length == 0) || (!$scope.files3 || $scope.files3.length == 0)){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
        }
        else if(!$scope.title || !$scope.subtitle || !$scope.startDate || !$scope.endDate || !$scope.location || !$scope.mobile){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
        }
        else if($scope.paytype == 3 && !$scope.point){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写积分！"});
        }
        else if($scope.point && (parseInt($scope.point) != $scope.point)){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"积分为正整数，请重新输入！"});
        }
        else if($scope.paytype == 1 && !$scope.price){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写金额！"});
        }
        else if($scope.price && (parseInt($scope.price) != $scope.price)){
            return $rootScope.$broadcast('alerts',{type:'danger',message:"金额为正整数，请重新输入！"});
        }
        else if($scope.mobile && !phoneReg.test($scope.mobile)){
            console.log("pp",one);
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        }else{
            if(one == true)return;
            one = true;
            console.log("oo",one);
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
                    $http.post(addActivityApi, {
                            //"activityId":$scope.id,
                            "title" : $scope.title,
                            "subTitle" : $scope.subtitle,
                            "point" : $scope.point,
                            "price" : $scope.price,
                            "startDate" : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
                            "endDate" : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
                            "location" : $scope.location,
                            "mobile" : $scope.mobile,
                            "content" : $scope.quill.getHTML(),
                            "payType" : $scope.paytype,
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
        }
    };

    //date
    $scope.former = function() {
        $scope.startDate = new Date();
    };
    $scope.former();

    $scope.afterward = function() {
        $scope.endDate = new Date(((new Date()).getTime() + 7*24*60*60*1000));
    };
    $scope.afterward();

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
    //var quill = new Quill('#editor-container', {
    //    modules: { toolbar: '#formatting-container' },
    //    theme: 'snow'
    //});
    //quill.on('selection-change', function(range) {
    //    console.log('selection-change', range)
    //});
    //quill.on('text-change', function(delta, source) {
    //    console.log('text-change', delta, source)
    //    console.log(quill.getHTML());
    //
    //});
    //quill.insertEmbed(1, 'image', 'http://quilljs.com/images/cloud.png');

    //quill editor
    $scope.$$postDigest(function(){
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





