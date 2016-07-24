/**
 * Created by gujun on 15/7/8.
 */

angular.module('ZJSY_WebappAdmin')
    .directive('month', function ($interval) {
        return {
            restrict: 'E',
            template: '<select ng-model="month" ng-change="setMonth()" class="form-control" \
            ng-options="item for item in optionList">\
                </select>',
            scope: {
                monthData : '@monthData'
            },
            replace : true,
            link: function (scope,elem,attr) {

                scope.$watch('monthData',function(data){

                    scope.month = scope.$parent[attr.monthData];
                });
                scope.setMonth = function(){
                    scope.$parent[attr.monthData] = scope.month;
                }
                var year = moment().year();
                scope.optionList = [];
                var yearCount = 0;
                while(yearCount <= 1){
                    if(yearCount == 0){
                      for(var i=moment().month();i>=0;i--){
                            scope.optionList.push((year-yearCount) + '-' + moment().month(i).format('MM'));
                        }
                    }
                    else{
                        for(var j=12;j>0;j--){
                            scope.optionList.push((year-yearCount) + '-' + moment().month(j-1).format('MM'));
                        }
                    }
                    yearCount++;
                }
            }
        };
    });
