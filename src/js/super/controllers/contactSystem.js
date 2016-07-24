/**
 * Created by qishi on 16/1/8.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ContactSystemController', function($scope,$http,$stateParams,$state,$rootScope){

    $scope.phone = "";

    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getPhoneApi= X_context.api + "meeting/listRooms";
    var contactUpdateApi = X_context.api + "meeting/updateMobile";


    $http.post(getPhoneApi,{

    }).success( function(data){
        $scope.phone = data.data[0].mobile;

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
            "phone" : $scope.phone

        }).success(function(){
            $state.reload();
            $rootScope.$broadcast('alerts',{type:'success',message:"联系方式设置成功！"});
        })
    }


});
