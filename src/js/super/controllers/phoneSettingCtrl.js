/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('PhoneSettingController', function($scope,$http,$state,$stateParams,$rootScope){


    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getSystemApi= X_context.api + "admin/listSysConfig";
    var systemUpdateApi = X_context.api + "admin/updateSysConfig";


    $http.post(getSystemApi,{
        //storeId : $scope.store ? $scope.store.id : null,
        id :1
    }).success( function(data){
        $scope.phone = data.data[0] ? data.data[0].sysPropertyIntroduce : null;
    });

    $http.post(getSystemApi,{
        //storeId : $scope.store ? $scope.store.id : null,
        //id :8
        "sysPropertyName" : "adminMobile"
    }).success( function(data){
        $scope.mobile = data.data[0] ? data.data[0].sysPropertyValue : null;
        $scope.id = data.data[0] ? data.data[0].id : 13;
    });

    $scope.update = function(){
        if(!$scope.phone)return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入联系方式！"});
        if($scope.phone && !phoneReg.test($scope.phone))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        $http.post(systemUpdateApi, {
                id :1,
                //storeId : $scope.store ? $scope.store.id : null,
                "sysPropertyIntroduce" : $scope.phone

            }

        ).success(function(data){

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

            });
    };



});
