/**
 * Created by swain on 15/12/1.
 */

X_context.host = config.apiHost;
X_context.api = X_context.host + "/zjsy/api/v1/";
X_context.apiForApp = X_context.host + "/zjsy-2.0/api/common/";
X_context.imgHost = "/products/";
X_context.storeImg = "/stores/";
X_context.devHost = (location.host == "localhost") ? X_context.host : "";


angular.module('ZJSY_Admin', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'dndLists'
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
            .state('shoppingManage', {
                url: '/shoppingManage',
                views: {
                    '': {
                        templateUrl: 'shoppingManage.html',
                        controller: 'ShoppingManageController'
                    }
                }
            })
            .state('addShopping', {
                url: '/addShopping',
                views: {
                    '': {
                        templateUrl: 'addShopping.html',
                        controller: 'AddShoppingController'
                    }
                }
            })
            .state('shoppingUpdate', {
                url: '/shoppingUpdate/{productId}',
                views: {
                    '': {
                        templateUrl: 'shoppingUpdate.html',
                        controller: 'ShoppingUpdateController'
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
            .state('typeAdd', {
                url: '/typeAdd',
                views: {
                    '': {
                        templateUrl: 'typeAdd.html',
                        controller: 'TypeAddController'
                    }
                }
            })
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
            .state('profile', {
                url: '/profile',
                views: {
                    '': {
                        templateUrl: 'profile.html',
                        controller: 'ProfileController'
                    }
                }
            })
            .state('shopAnnouncement', {
                url: '/shopAnnouncement',
                views: {
                    '': {
                        templateUrl: 'shopAnnouncement.html',
                        controller: 'ShopAnnouncementController'
                    }
                }
            })
            .state('card', {
                url: '/card',
                views: {
                    '': {
                        templateUrl: 'card.html',
                        controller: 'CardController'
                    }
                }
            })
            .state('cardBinding', {
                url: '/cardBinding',
                views: {
                    '': {
                        templateUrl: 'cardBinding.html',
                        controller: 'CardBindingController'
                    }
                }
            })
            .state('advertisementManage', {
                url: '/advertisementManage',
                views: {
                    '': {
                        templateUrl: 'advertisementManage.html',
                        controller: 'AdvertisementManageController'
                    }
                }
            })
            .state('advertisementAdd', {
                url: '/advertisementAdd',
                views: {
                    '': {
                        templateUrl: 'advertisementAdd.html',
                        controller: 'AdvertisementAddController'
                    }
                }
            })
            .state('advertisementUpdate', {
                url: '/advertisementUpdate/{bannerId}',
                views: {
                    '': {
                        templateUrl: 'advertisementUpdate.html',
                        controller: 'AdvertisementUpdateController'
                    }
                }
            })
            .state('couponList', {
                url: '/couponList',
                views: {
                    '': {
                        templateUrl: 'couponList.html',
                        controller: 'CouponListController'
                    }
                }
            })
            .state('couponDetail', {
                url: '/couponDetail/{couponId}',
                views: {
                    '': {
                        templateUrl: 'couponDetail.html',
                        controller: 'CouponDetailController'
                    }
                }
            })
            .state('couponStat', {
                url: '/couponStat/{couponId}',
                views: {
                    '': {
                        templateUrl: 'couponStat.html',
                        controller: 'CouponStatController'
                    }
                }
            })
            .state('couponCount', {
                url: '/couponCount',
                views: {
                    '': {
                        templateUrl: 'couponCount.html',
                        controller: 'CouponCountController'
                    }
                }
            })
            .state('couponFree', {
                url: '/couponFree',
                views: {
                    '': {
                        templateUrl: 'couponFree.html',
                        controller: 'CouponFreeController'
                    }
                }
            })
            .state('couponFull', {
                url: '/couponFull',
                views: {
                    '': {
                        templateUrl: 'couponFull.html',
                        controller: 'CouponFullController'
                    }
                }
            })
            .state('couponCash', {
                url: '/couponCash',
                views: {
                    '': {
                        templateUrl: 'couponCash.html',
                        controller: 'CouponCashController'
                    }
                }
            })
            .state('couponFreeCancel', {
                url: '/couponFreeCancel',
                views: {
                    '': {
                        templateUrl: 'couponFreeCancel.html',
                        controller: 'CouponFreeCancelController'
                    }
                }
            })
            .state('systemSetting', {
                url: '/systemSetting',
                views: {
                    '': {
                        templateUrl: 'systemSetting.html',
                        controller: 'SystemSettingController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/orderManage');

    });