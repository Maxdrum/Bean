/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('ProfileController', function($scope,$http,$state,$stateParams,$rootScope){
    $scope.id ="";
    $scope.username = "";
    $scope.phone = "";
    $scope.email = "";
    $scope.password = "";
    $scope.portrait = "";

    //var emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var phoneReg = /(^(\d{2}[ -]\d{2,4}[ -]\d{8}))$|(^(\d{2,4}[ -]\d{8}))$|(^[0-9]{11}$)/;
    var getMeApi = X_context.api  + "user/getCurUser ";
    var updateApi = X_context.api  + "user/update";
    var updatePwdApi = X_context.api  + "user/modifyPwd";

    getMe();

    function getMe(){
        $http.get(getMeApi,{
        }).
            success( function(data){
                $scope.username = data.data[0].name;
                $scope.phone = data.data[0].phone;
                $scope.email = data.data[0].email;
                $scope.oldPwd = data.data[0].password;
                $scope.userId = data.data[0]._id;
                //$scope.portrait = data.data[0].portrait;
            });
    }
    console.log($scope.password);

    $scope.update = function(){
        //if($scope.email && !emailReg.test($scope.email))
        //    return $rootScope.$broadcast('alerts',{type:'danger',message:"请正确输入邮箱地址！"});
        if($scope.phone && !phoneReg.test($scope.phone))
            return $rootScope.$broadcast('alerts',{type:'danger',message:"请输入正确的电话号码！"});
        $http.post(updateApi,{
                //companyId : X_context.storeId,
                "phone" : $scope.phone,
                "name" : $scope.username,
                "userId":$scope.userId
                //"email":$scope.email?$scope.email:""

            }
        ).success(function(data){
                $rootScope.$broadcast('alerts',{type:'success',message:"修改个人信息成功！"});
                $state.reload();
                //getMe();
            });
    };

    $scope.changePwdwithOld = function(){
        //if($scope.pwdNotEqual == true)return;
        //var shaObj = new jsSHA("SHA-512", "TEXT");
        //shaObj.update($scope.password);
        //var Oldhash = shaObj.getHash("HEX");
        //
        //var shaObjNew = new jsSHA("SHA-512", "TEXT")
        //shaObjNew.update($scope.pwd_1);
        //var newhash = shaObjNew.getHash("HEX");
        $http.post(updatePwdApi,{
                "userId":$scope.userId,
                "password":$scope.formerPwd,
                "new_password":$scope.pwd_1
            }
        ).success(function(data){
                //if($scope.oldPwd != $scope.formerPwd)
                //    return $rootScope.$broadcast('alerts',{type:'danger',message:"原密码输入不正确，请重试！"});
                console.log("pwd changed");
                $scope.formerPwd = null;
                $scope.pwd_1 = null;
                $scope.pwd_2 = null;
                $rootScope.$broadcast('alerts',{type:'success',message:"密码修改成功！"});
                //getMe();
            }).error(function(data){
                if(data.code == 400) {
                    alert('原密码错误，请重试！')
                }
            })

    };



    //$scope.$watch('changePwd',function(){
    //    $scope.pwdNotEqual = $scope.changePwd && ($scope.pwd_1 != $scope.pwd_2);
    //});
    $scope.$watch('pwd_1',function(){
        $scope.pwdNotEqual = ($scope.pwd_1 != $scope.pwd_2);
    });
    $scope.$watch('pwd_2',function(){
        $scope.pwdNotEqual = ($scope.pwd_1 != $scope.pwd_2);
    });


});