/**
 * Created by gujun on 15/4/28.
 */
angular.module('ZJSY_PropertyAdmin').factory('ajaxInterceptor', function ($q,$rootScope,$location) {
  return {
    response: function (response) {
      if(response.headers()['content-type'] === "application/json; charset=utf-8"){
        // Validate response, if not ok reject
        if( response.data.code && response.data.status ){
          if(response.data.status == "ok" && (response.data.code == "200")){
            return response;
          }else{
              $rootScope.$broadcast('alerts',{type:'danger',message:response.data.msg || "系统错误。"});
              return $q.reject(response);
        }
      }
      }
      if(response.data.status == 404 ){
        $rootScope.$broadcast('alerts',{type:'danger',message:'资源不存在。'});
        $location.path('/home');
        return $q.reject(response);
      }
      return response;
    },
    responseError: function(response) {
      location.href="/home";
      return $q.reject(response);
    }
  };
});
