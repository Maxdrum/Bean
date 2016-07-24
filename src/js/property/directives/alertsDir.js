/**
 * Created by gujun on 15/11/26.
 */

angular.module('ZJSY_PropertyAdmin')
    .directive('alerts', function ($interval,$timeout) {
        return {
            restrict: 'E',
            template: '<div class="site-alert col-sm-12 " style="position: absolute;top: 100px;z-index: 9999;width: 20%;margin-left: 40%;">\
                <uib-alert class="alert alert-dismissible" role="alert" type="{{alerts[alerts.length-1].type}}" close="closeAlert(alerts.length-1)" ng-show="alerts.length > 0">{{alerts[alerts.length-1].msg}}</uib-alert>\
                </div>',
            scope: true,
            link: function (scope) {
                scope.alerts = [
                ];


                scope.closeAlert = function(index) {
                    scope.alerts.splice(index, 1);
                };


                //var interval = $interval(function(){scope.alerts = _.drop(scope.alerts)},5000);

                scope.$on(
                    "$destroy",
                    function(  ) {
                        //$interval.cancel(interval);

                    }
                );

                scope.$on('alerts',function(event, _alert){
                    scope.alerts.push({type: _alert.type, msg: _alert.message});
                    $timeout(function(){
                        scope.alerts = _.drop(scope.alerts);
                    },3000);
                })
            }
        };
    });
