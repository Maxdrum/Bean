/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ParkInfoAddController', function($scope,$http,$state,$stateParams,Upload,$location,$rootScope,$q){

    var one = false;

    var addInfoApi = X_context.api + "info/addParkInfo";


    $scope.addActivity = function(){

            if((!$scope.files || $scope.files.length == 0) || (!$scope.files2 || $scope.files2.length == 0))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"未上传图片，请上传图片后重试！"});
            else if(!$scope.title || !$scope.subtitle)
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});
            else{
                if(one == true)return;
                one = true;
                var listImgPromise = Promise.resolve();
                var bannerImgPromise = Promise.resolve();
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

                $q.all([listImgPromise,bannerImgPromise]).then(function(datas){
                    console.log(datas);
                    $http.post(addInfoApi, {
                            //"activityId":$scope.id,
                            "title" : $scope.title,
                            "subTitle" : $scope.subtitle,
                            "content" : $scope.quill.getHTML(),
                            "image" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
                            "banner" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null,
                            "showBanner" : ($scope.showBanner == true) ? 1 : 0
                        }

                    ).success(function(data){

                            $state.transitionTo('parkList')
                        });
                })
            }

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

