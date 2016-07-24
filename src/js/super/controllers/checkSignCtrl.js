/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('CheckSignController', function($scope,$http,$stateParams,$state,$location,$rootScope){

    $scope.currentSignList = [];

    $scope.id = $stateParams.activityId;

    var signListApi = X_context.api + "activity/listAllEnroll";

    function getPageData(){
        $http.post(signListApi,{
            "activityId" : $scope.id
        })
            .success(function(data){
                $scope.currentSignList = data.data || [];

            });
    }
    getPageData();

    $scope.export = function () {
        //var blob = new Blob([document.getElementById('exportable').innerHTML], {
        //    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        //});
        //saveAs(blob, "报名信息.xls");
        window.location.href = X_context.api + "activity/exportEnroll/" + $scope.id;
    };

});






