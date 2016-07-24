/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CompanyShowUpdateController', function($scope,$http,$state,$stateParams,Upload,$location,$rootScope,$q){

    $scope.title = "";
    $scope.subtitle = "";
    $scope.image = "";

    $scope.id = $stateParams.showId;

    var getInfoListApi= X_context.api + "info/getInfoDetail";
    var infoUpdateApi = X_context.api + "info/updateCompanyInfo";
    console.log( $scope.id);

    $scope.goBack = function(){
        window.history.back();
    };

    var initPromise = $http.post(getInfoListApi,{
        activityId: $scope.id

    }).success( function(data){
        $scope.title = data.data[0].title;
        $scope.subtitle = data.data[0].subTitle;
        $scope.image = X_context.devHost + (data.data[0].image + '?' + Math.floor(Math.random()*100000));
        $scope.banner = X_context.devHost + (data.data[0].banner + '?' + Math.floor(Math.random()*100000));
        $scope.content = data.data[0].content;
        $scope.showBanner = (data.data[0].showBanner == 1) ? true : false;
    });


    $scope.update = function(){
        if(!$scope.title || !$scope.subtitle)
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请填写完整信息后重试！"});

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
            $http.post(infoUpdateApi, {
                    "activityId":$scope.id,
                    "title" : $scope.title,
                    "subTitle" : $scope.subtitle,
                    "content" : $scope.quill.getHTML(),
                    "image" : ($scope.files && $scope.files.length > 0) ? datas[0].data.data[0] : null,
                    "banner" : ($scope.files2 && $scope.files2.length > 0) ? datas[1].data.data[0] : null,
                    "showBanner" : ($scope.showBanner == true) ? 1 : 0
                }

            ).success(function(data){

                    $state.transitionTo('companyShowList')
                });
        })

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
