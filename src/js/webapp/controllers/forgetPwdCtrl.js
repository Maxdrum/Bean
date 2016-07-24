/**
 * Created by gujun on 15/7/8.
 */

'use strict';

angular.module('ZJSY_WebappAdmin')
    .controller('ForgetPwdController', function ($scope,$http,$interval,$state,$rootScope) {

        var btnStr = "获取验证码";
        //$scope.username = "";
        $scope.loginName = "";
        $scope.id = "";
        $scope.captchaDisabled = false;
        $scope.captchaBtn = btnStr;
        $scope.captcha = "";
        $scope.changePwdSucceed = false;

        var sendCaptchaApi = X_context.api + "user/fetchUserAuthCode";
        var updatePwdApi = X_context.api + "user/updatePassword";

        $scope.sendCAPTCHA = function(){
            if(!$scope.loginName)
                return alert("请正确输入登录名后重试");
            $http.post(sendCaptchaApi,
                {
                    "loginName": $scope.loginName
                })
                .success(function(data){

                        $scope.captchaDisabled = true;
                        var timer = 60;
                        var interval = $interval(function(){
                            $scope.captchaBtn = "请稍后:"+timer;
                            timer--;
                            if(timer == 0){
                                $interval.cancel(interval);
                                $scope.captchaDisabled = false;
                                $scope.captchaBtn = btnStr;
                            }
                        },1000);

                        $scope.$on(
                            "$destroy",
                            function(  ) {
                                $interval.cancel(interval);

                            }
                        );
                }).error(function(data){
                    if(data.code == 400) {
                        alert('没有使用此登录名的用户，请确认你的登录名后重试！')
                    }});
        }

        $scope.changePwdwithCAP = function(){
            if(!$scope.loginName || !$scope.pwd_1 || !$scope.captcha)
                return alert("请正确输入所有信息后重试");
            //var shaObjNew = new jsSHA("SHA-512", "TEXT")
            //shaObjNew.update($scope.pwd_1);
            //var newhash = shaObjNew.getHash("HEX");
            $http.post(updatePwdApi,
                {
                    "loginName": $scope.loginName,
                    "authCode": $scope.captcha,
                    "password":$scope.pwd_1
                }).success(function(data){
                    if(data.code == 200){
                        $scope.changePwdSucceed = true;
                    }
                }).error(function(data){
                if(data.code == 400 || data.code == 500) {
                    alert('密码修改失败，请稍后重试或者联系管理员！')
                }});
        }


        $scope.$watch('pwd_1',function(){
            $scope.pwdNotEqual = ($scope.pwd_1 != $scope.pwd_2);
        });
        $scope.$watch('pwd_2',function(){
            $scope.pwdNotEqual = ($scope.pwd_1 != $scope.pwd_2);
        });

    });
