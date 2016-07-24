/**
 * Created by swain on 15/12/2.
 */
"use strict";
angular.module('ZJSY_PropertyAdmin').controller('PropertySettingController', function($scope,$http,$state,$stateParams,Upload,$rootScope){

    $scope.phone = "";
    $scope.mobile = "";

    //var phoneReg = /^\(?([0-9]{2})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{8})$/;
    //var phoneReg = /^(\(?([0-9]{2})\)?(\-|\))?([0-9]{2,4})(\-)?([0-9]{8})|(\(?([0-9]{2,4})\)?(\-)?([0-9]{8}))|([0-9]{11}))$/;
    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getPhoneApi= X_context.api + "services/list";
    var contactUpdateApi = X_context.api + "services/updateTel";
    var getSystemApi= X_context.api + "admin/listSysConfig";
    var systemUpdateApi = X_context.api + "admin/updateSysConfig";


    $http.post(getPhoneApi,{

    }).success( function(data){
        $scope.phone = data.data[0].mobile;

    });

    $http.post(getSystemApi,{
        //storeId : $scope.store ? $scope.store.id : null,
        //id :9
        "sysPropertyName" : "propertyMobile"
    }).success( function(data){
        $scope.mobile = data.data[0] ? data.data[0].sysPropertyValue : null;
        $scope.id = data.data[0] ? data.data[0].id : 14;
    });

    $scope.saveSetting = function(){
        if(!$scope.phone)return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入联系方式！"});
        if($scope.phone && !phoneReg.test($scope.phone))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        //if(parseInt($scope.phone) != $scope.phone)
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        //if($scope.phone.length == 9 || $scope.phone.length == 10)
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"只能输入固定电话(不含区号)或手机号！"});
        $http.post(contactUpdateApi,{
            "mobile" : $scope.phone

        }).success(function(){
            if(!$scope.mobile)return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入手机号！"});
            if($scope.mobile && !phoneReg.test($scope.mobile))
                return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的手机号！"});
            $http.post(systemUpdateApi, {
                    id : $scope.id,
                    //storeId : $scope.store ? $scope.store.id : null,
                    "sysPropertyValue" : $scope.mobile

                }

            ).success(function(data){
                    $rootScope.$broadcast('alerts',{type:'success',message:"配置修改成功！"});
                    $state.reload();
                });
        })
    }

});

