/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('SignSettingController', function($scope,$http,$state,$stateParams,$rootScope){

    var getSystemApi= X_context.apiForApp + "config/checkinRule";
    var systemUpdateApi = X_context.apiForApp + "config/updateCheckinRule";


    $http.get(getSystemApi,{

    }).success( function(data){
        $scope.dayPoint = data.data ? data.data.basePoint : 10;
        $scope.doublePoint = data.data ? data.data.extPoint : 10;
        $scope.days = data.data ? data.data.interval : 7;
    });

    $scope.update = function(){

        $http.post(systemUpdateApi, {
                "basePoint" : $scope.dayPoint,
                "extPoint" : $scope.doublePoint,
                "interval" : $scope.days

            }

        ).success(function(data){
                $rootScope.$broadcast('alerts',{type:'success',message:"配置修改成功！"});
                $state.reload();
            });
    };

    $scope.$watch('days',function(newVal,oldVal){
        console.log(newVal,oldVal);
        if(newVal == 0){
            $scope.doublePoint = 0;
        }
    })

});

