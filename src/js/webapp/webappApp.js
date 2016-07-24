
X_context.host = config.apiHost;
X_context.api = X_context.host + "/zjsy/api/v1/";
//X_context.storeId = "1";
//X_context.authorization = "abdf374328fee38ef40d8cfaeb7bc0a75968d10a01d9da099abc460b6eecae45";
angular.module('ZJSY_WebappAdmin', [
    'ui.router',
    'ui.bootstrap'
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
            .state('home', {

                url: '/home',
                views: {
                    '': {
                        templateUrl: 'home.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('forgetPwd', {
                url: '/forgetPwd',
                views: {
                    '': {
                        templateUrl: 'forgetPwd.html',
                        controller: 'ForgetPwdController'
                    }
                }
            });


        $urlRouterProvider.otherwise('/home');

    });