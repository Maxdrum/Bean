/**
 * Created by gujun on 15/5/19.
 */
angular.module('ZJSY_PropertyAdmin').filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});