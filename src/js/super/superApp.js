/**
 * Created by swain on 15/12/1.
 */

X_context.host = config.apiHost;
X_context.api = X_context.host + "/zjsy/api/v1/";
X_context.apiForApp = X_context.host + "/zjsy-2.0/api/common/";
X_context.imgHost = "/products/";
X_context.storeImg = "/stores/";
X_context.storeListImg = "/stores/list/";
X_context.devHost = (location.host == "localhost") ? X_context.host : "";

angular.module('ZJSY_SuperAdmin', [
    'ui.router',
    'ui.bootstrap',
    'ngFileUpload',
    'dndLists'
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
            .state('shopManage', {
                url: '/shopManage',
                views: {
                    '': {
                        templateUrl: 'shopManage.html',
                        controller: 'ShopManageController'
                    }
                }
            })
            .state('shopCreate', {
                url: '/shopCreate',
                views: {
                    '': {
                        templateUrl: 'shopCreate.html',
                        controller: 'ShopCreateController'
                    }
                }
            })
            .state('shopUpdate', {
                url: '/shopUpdate/{shopId}',
                views: {
                    '': {
                        templateUrl: 'shopUpdate.html',
                        controller: 'ShopUpdateController'
                    }
                }
            })
            .state('memberManage', {
                 url: '/memberManage',
                 views: {
                     '': {
                         templateUrl: 'memberManage.html',
                         controller: 'MemberManageController'
                     }
                 }
            })
            .state('memberCreate', {
                url: '/memberCreate',
                views: {
                    '': {
                        templateUrl: 'memberCreate.html',
                        controller: 'MemberCreateController'
                    }
                }
            })
            .state('memberUpdate', {
                url: '/memberUpdate/{memberId}',
                views: {
                    '': {
                        templateUrl: 'memberUpdate.html',
                        controller: 'MemberUpdateController'
                    }
                }
            })
            .state('orderCount', {
                url: '/orderCount',
                views: {
                    '': {
                        templateUrl: 'orderCount.html',
                        controller: 'OrderCountController'
                    }
                }
            })
            .state('orderBrowse', {
                url: '/orderBrowse/{orderId}',
                views: {
                    '': {
                        templateUrl: 'orderBrowse.html',
                        controller: 'OrderBrowseController'
                    }
                }
            })
            .state('activityManage', {
                url: '/activityManage',
                views: {
                    '': {
                        templateUrl: 'activityManage.html',
                        controller: 'ActivityManageController'
                    }
                }
            })
            .state('activityAdd', {
                url: '/activityAdd',
                views: {
                    '': {
                        templateUrl: 'activityAdd.html',
                        controller: 'ActivityAddController'
                    }
                }
            })
            .state('activityUpdate', {
                url: '/activityUpdate/{activityId}',
                views: {
                    '': {
                        templateUrl: 'activityUpdate.html',
                        controller: 'ActivityUpdateController'
                    }
                }
            })
            .state('checkSign', {
                url: '/checkSign/{activityId}',
                views: {
                    '': {
                        templateUrl: 'checkSign.html',
                        controller: 'CheckSignController'
                    }
                }
            })
            .state('activityOrder', {
                url: '/activityOrder',
                views: {
                    '': {
                        templateUrl: 'activityOrder.html',
                        controller: 'ActivityOrderController'
                    }
                }
            })
            .state('activityOrderDetail', {
                url: '/activityOrderDetail/{orderId}',
                views: {
                    '': {
                        templateUrl: 'activityOrderDetail.html',
                        controller: 'ActivityOrderDetailController'
                    }
                }
            })
            .state('meetingList', {
                url: '/meetingList',
                views: {
                    '': {
                        templateUrl: 'meetingList.html',
                        controller: 'MeetingListController'
                    }
                }
            })
            .state('meetingAdd', {
                url: '/meetingAdd',
                views: {
                    '': {
                        templateUrl: 'meetingAdd.html',
                        controller: 'MeetingAddController'
                    }
                }
            })
            .state('meetingOrder', {
                url: '/meetingOrder',
                views: {
                    '': {
                        templateUrl: 'meetingOrder.html',
                        controller: 'MeetingOrderController'
                    }
                }
            })
            .state('meetingOrderDetail', {
                url: '/meetingOrderDetail/{orderId}',
                views: {
                    '': {
                        templateUrl: 'meetingOrderDetail.html',
                        controller: 'MeetingOrderDetailController'
                    }
                }
            })
            .state('meetingUpdate', {
                url: '/meetingUpdate/{meetingId}',
                views: {
                    '': {
                        templateUrl: 'meetingUpdate.html',
                        controller: 'MeetingUpdateController'
                    }
                }
            })
            .state('contactSystem', {
                url: '/contactSystem',
                views: {
                    '': {
                        templateUrl: 'contactSystem.html',
                        controller: 'ContactSystemController'
                    }
                }
            })
            .state('parkList', {
                url: '/parkList',
                views: {
                    '': {
                        templateUrl: 'parkList.html',
                        controller: 'ParkListController'
                    }
                }
            })
            .state('parkInfoAdd', {
                url: '/parkInfoAdd',
                views: {
                    '': {
                        templateUrl: 'parkInfoAdd.html',
                        controller: 'ParkInfoAddController'
                    }
                }
            })
            .state('parkInfoUpdate', {
                url: '/parkInfoUpdate/{infoId}',
                views: {
                    '': {
                        templateUrl: 'parkInfoUpdate.html',
                        controller: 'ParkInfoUpdateController'
                    }
                }
            })
            .state('companyShowList', {
                url: '/companyShowList',
                views: {
                    '': {
                        templateUrl: 'companyShowList.html',
                        controller: 'CompanyShowListController'
                    }
                }
            })
            .state('companyShowAdd', {
                url: '/companyShowAdd',
                views: {
                    '': {
                        templateUrl: 'companyShowAdd.html',
                        controller: 'CompanyShowAddController'
                    }
                }
            })
            .state('companyShowUpdate', {
                url: '/companyShowUpdate/{showId}',
                views: {
                    '': {
                        templateUrl: 'companyShowUpdate.html',
                        controller: 'CompanyShowUpdateController'
                    }
                }
            })
            .state('orderList', {
                url: '/orderList',
                views: {
                    '': {
                        templateUrl: 'orderList.html',
                        controller: 'OrderListController'
                    }
                }
            })
            .state('categoryManage', {
                url: '/categoryManage',
                views: {
                    '': {
                        templateUrl: 'categoryManage.html',
                        controller: 'CategoryManageController'
                    }
                }
            })
            .state('categoryAdd', {
                url: '/categoryAdd',
                views: {
                    '': {
                        templateUrl: 'categoryAdd.html',
                        controller: 'CategoryAddController'
                    }
                }
            })
            .state('categoryUpdate', {
                url: '/categoryUpdate/{servicesId}',
                views: {
                    '': {
                        templateUrl: 'categoryUpdate.html',
                        controller: 'CategoryUpdateController'
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
            .state('financing', {
                url: '/financing',
                views: {
                    '': {
                        templateUrl: 'financing.html',
                        controller: 'FinancingController'
                    }
                }
            })
            .state('financingDetail', {
                url: '/financingDetail/{orderId}',
                views: {
                    '': {
                        templateUrl: 'financingDetail.html',
                        controller: 'FinancingDetailController'
                    }
                }
            })
            .state('bannerManage', {
                url: '/bannerManage',
                views: {
                    '': {
                        templateUrl: 'bannerManage.html',
                        controller: 'BannerManageController'
                    }
                }
            })
            .state('bannerAdd', {
                url: '/bannerAdd',
                views: {
                    '': {
                        templateUrl: 'bannerAdd.html',
                        controller: 'BannerAddController'
                    }
                }
            })
            .state('bannerUpdate', {
                url: '/bannerUpdate/{bannerId}',
                views: {
                    '': {
                        templateUrl: 'bannerUpdate.html',
                        controller: 'BannerUpdateController'
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
            })
            .state('phoneSetting', {
                url: '/phoneSetting',
                views: {
                    '': {
                        templateUrl: 'phoneSetting.html',
                        controller: 'PhoneSettingController'
                    }
                }
            })
            .state('signSetting', {
                url: '/signSetting',
                views: {
                    '': {
                        templateUrl: 'signSetting.html',
                        controller: 'SignSettingController'
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

        $urlRouterProvider.otherwise('/orderCount');

    });