X_context.host = config.apiHost;
X_context.api = X_context.host + "/zjsy/api/v1/";
X_context.imgHost = "/products/";
X_context.storeImg = "/stores/";
X_context.devHost = (location.host == "localhost") ? X_context.host : "";


angular.module('ZJSY_PropertyAdmin', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload'
    //'ui.calendar'
])
    .config(function($stateProvider, $urlRouterProvider,$httpProvider) {

        $httpProvider.defaults.headers.post = {
            "Content-Type" : "application/json;charset=utf-8",
            "Authorization" : X_context.authorization
        };
        $httpProvider.defaults.headers.put = {
            "Content-Type" : "application/json;charset=utf-8",
            "Authorization" : X_context.authorization
        };
        $httpProvider.defaults.headers.get = {
            "Authorization" : X_context.authorization
        };
        $httpProvider.defaults.headers.delete = {
            "Content-Type" : "application/json;charset=utf-8",
            "Authorization" : X_context.authorization
        };

        $stateProvider
            .state('orderManage', {
                url: '/orderManage',
                views: {
                    '': {
                        templateUrl: 'orderManage.html',
                        controller: 'OrderManageController'
                    }
                }
            })
            .state('orderDetail', {
                url: '/orderDetail/{orderId}',
                views: {
                    '': {
                        templateUrl: 'orderDetail.html',
                        controller: 'OrderDetailController'
                    }
                }
            })
            .state('typeManage', {
                url: '/typeManage',
                views: {
                    '': {
                        templateUrl: 'typeManage.html',
                        controller: 'TypeManageController'
                    }
                }
            })
            .state('typePicture', {
                url: '/typePicture',
                views: {
                    '': {
                        templateUrl: 'typePicture.html',
                        controller: 'TypePictureController'
                    }
                }
            })
            .state('propertyAdd', {
                url: '/propertyAdd',
                views: {
                    '': {
                        templateUrl: 'propertyAdd.html',
                        controller: 'PropertyAddController'
                    }
                }
            })
            .state('propertyUpdate', {
                url: '/propertyUpdate/{servicesId}',
                views: {
                    '': {
                        templateUrl: 'propertyUpdate.html',
                        controller: 'PropertyUpdateController'
                    }
                }
            })
            .state('propertySetting', {
                url: '/propertySetting',
                views: {
                    '': {
                        templateUrl: 'propertySetting.html',
                        controller: 'PropertySettingController'
                    }
                }
            })
            .state('profile', {
                url: '/profile',
                views: {
                    '': {
                        templateUrl: 'profile.html',
                        controller: 'ProfileController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/orderManage');

    });