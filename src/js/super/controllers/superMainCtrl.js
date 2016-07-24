angular.module('ZJSY_SuperAdmin')

    .controller('SuperMainController', function($scope,$http,$location){
        "use strict";

        $scope.leftShow = true;

        var getMeApi = X_context.api  + "user/getCurUser";

        $scope.isActive = function (route) {
            if(_.indexOf($location.path().split('/'),route.split('/')[1])>0){

                //if($location.path().indexOf(route) !=-1){
                return true;
            }else{
                return false;
            }

        }

        $scope.logout = function(){
            location.href = X_context.host + "/zjsy/admin/logout";
        }

        $scope.leftWidth = "220px";

        $scope.hide_left_panel = function(){
            $scope.leftWidth = "60px";
            $scope.leftShow = false;
        }

        $scope.show_left_panel = function(){
            $scope.leftShow = true;
            $scope.leftWidth = "220px";
        }

        getMe();

        function getMe(){
            $http.get(getMeApi,{
            }).
                success( function(data){
                    $scope.username = data.data[0].name;
                });
        }

        //$(document).ready( function() {
        //    var $submenu = $('.submenu');
        //    var $left_menu_module = $('.left_menu_module');
        //    $submenu.hide();
        //    $submenu.first().delay(400).slideDown(700);
        //    $submenu.on('click','li', function() {
        //        $submenu.siblings().find('li').removeClass('chosen');
        //        $(this).addClass('chosen');
        //    });
        //    $left_menu_module.on('click', 'li', function() {
        //        $(this).next('.submenu').slideToggle().siblings('.submenu').slideUp();
        //    });
        //    $left_menu_module.children('li:last-child').on('click', function() {
        //        $left_menu_module.fadeOut().delay(500).fadeIn();
        //    });
        //});


    });
