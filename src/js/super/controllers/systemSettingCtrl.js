/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('SystemSettingController', function($scope,$http,$state,$stateParams,$rootScope){
    $scope.sysPropertyValue = "";

    //var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getSystemApi= X_context.api + "admin/listSysConfig";
    var systemUpdateApi = X_context.api + "admin/updateSysConfig";


    $http.post(getSystemApi,{
        //storeId : $scope.store ? $scope.store.id : null,
        id :1
    }).success( function(data){
        $scope.money = data.data[0] ? data.data[0].sysPropertyValue.split(":")[0] : null;
        $scope.point = data.data[0] ? data.data[0].sysPropertyValue.split(":")[1] : null;
        //$scope.phone = data.data[0] ? data.data[0].sysPropertyIntroduce : null;
    });

    $scope.update = function(){
        if((parseInt($scope.money) != $scope.money) || (parseInt($scope.point) != $scope.point))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入整数值！"});
        //if(!$scope.phone)return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入联系方式！"});
        //if($scope.phone && !phoneReg.test($scope.phone))
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        $http.post(systemUpdateApi, {
                id :1,
                //storeId : $scope.store ? $scope.store.id : null,
                "sysPropertyValue" : $scope.money + ":" + $scope.point
                //"sysPropertyIntroduce" : $scope.phone

            }

        ).success(function(data){
                $rootScope.$broadcast('alerts',{type:'success',message:"配置修改成功！"});
                $state.reload();
            });
    };

});
