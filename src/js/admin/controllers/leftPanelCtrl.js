angular.module('ZJSY_Admin')

.controller('LeftPanelController', function($scope,$location){
        "use strict";

        $(document).ready( function() {
            var $submenu = $('.submenu');
            var $left_menu_module = $('.left_menu_module');
            console.log($left_menu_module)
            $submenu.hide();
            $submenu.first().delay(400).slideDown(700);
            $('.left_menu_module li').first().children().children('.glyphicon').delay(400).toggleClass('glyphicon-triangle-right');
            $('.left_menu_module li').first().children().children('.glyphicon').delay(400).toggleClass('glyphicon-triangle-bottom');
            $submenu.on('click','li', function() {
                $submenu.siblings().find('li').removeClass('chosen');
                $(this).addClass('chosen');
            });

            $left_menu_module.on('click', 'li', function() {
                console.log('here');
                if($(this).next('.submenu').length == 0)return;
                //console.log('ad',$(this).children().children('.glyphicon'))
                $(this).children().children('.glyphicon').toggleClass('glyphicon-triangle-right');
                $(this).children().children('.glyphicon').toggleClass('glyphicon-triangle-bottom');
                $(this).next('.submenu').slideToggle().siblings('.submenu');
            });

            //$left_menu_module.children('li:last-child').on('click', function() {
            //    $left_menu_module.fadeOut().delay(500).fadeIn();
            //});
        });
});