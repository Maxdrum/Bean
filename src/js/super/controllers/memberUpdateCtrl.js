/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MemberUpdateController', function($scope,$http,$stateParams,$rootScope){
    $scope.phone = "";
    $scope.signDate = "";
    $scope.lastDate = "";
    $scope.point = "";
    $scope.id = $stateParams.memberId;



    var getMemberApi= X_context.api + "member/list";
    var updateMemberApi = X_context.api + "member/update";

    $http.post(getMemberApi,{
        _id: $scope.id
    }).success( function(data){
       if(!data.data[0])return;
       $scope.phone = data.data[0].mobile;
       $scope.signDate = data.data[0].createDate;
       $scope.lastDate = data.data[0].modifyDate;
       $scope.point = data.data[0].point;
    });

    $scope.update = function(){
        $http.post(updateMemberApi, {
                //"id":$scope.id,
                point : $scope.point
            }

        ).success(function(data){
            $rootScope.$broadcast('alerts',{type:'success',message:"会员修改成功！"});
            $state.reload();
        });
    };
});




