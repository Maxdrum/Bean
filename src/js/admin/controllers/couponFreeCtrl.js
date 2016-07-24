/**
 * Created by qishi on 15/12/2.
 */
"use strict";
angular.module('ZJSY_Admin').controller('CouponFreeController', function($scope,$http,$state,$stateParams,$location,Upload,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }
    $scope.pageSize = 10;
    $scope.pageNum = null;
    $scope.totalCount = null;
    $scope.currentCategoryList = [];
    $scope.currentShoppingList = [];
    $scope.currentList = [];
    $scope.allSelected = false;
    $scope.selected = false;
    $scope.hasAddAccounts = false;
    $scope.hasDeleteAccounts = false;
    var two = false;

    var categoryListApi = X_context.api + "category/list";
    var shoppingListApi = X_context.api + "product/list";
    var newCouponApi = X_context.api + "coupon/add";

    var categoryPromise = $http.post(categoryListApi,{
        storeId : X_context.storeId
        //category : 1,
    })
        .success(function(data){
            var currentCategoryList = data.data || [];
            $scope.currentCategoryList = currentCategoryList;
        });

    var vm = $scope.multiSelect = {};
    $scope.multiSelect.options = [];

    vm.selection = function() {
        return _.where($scope.multiSelect.options, {checked: true});
    }

    function getPageData(one){

        categoryPromise.then(function(){
            $http.post(shoppingListApi,{
                storeId : X_context.storeId,
                page : $scope.currentPage,
                pageSize : $scope.pageSize,
                productName :  $scope.name ? $scope.name : null,
                category : $scope.category ? $scope.category.id : null
            })
                .success(function(data){
                    $location.search({'page': $scope.currentPage});
                    var currentShoppingList = data.data || [];
                    $scope.currentShoppingList = currentShoppingList;
                    if((one==false) && data.data.length == 0){
                        $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关商品，请正确输入信息后重试！"});
                        $scope.totalCount = 0;
                        $scope.pageNum = 0;
                    }
                    if(data.data.length != 0){
                        var totalCount = data.data[0].totalCount;
                        $scope.totalCount = data.data[0].totalCount;
                        $scope.pageNum = (totalCount  && currentShoppingList.length >= 1)
                            ? Math.ceil(totalCount / $scope.pageSize)
                            : 1;
                    }
                    if((one==true) && data.data.length == 0){
                        $scope.totalCount = 0;
                        $scope.pageNum = 0;
                    }

                });
        });
    }
    getPageData(true);
    $scope.getPageData = getPageData;

    $scope.$watch('category',function(){
        $scope.name = '';
        getPageData(true);
    });

    $scope.$watch('currentPage',function(){
        getPageData();
    });

    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    }
    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    }

    $scope.newCoupon = function(){
        if(two == true)return;
        two = true;
            categoryPromise.then(function(){
                var currentStart = new Date($scope.startDate);
                var currentEnd = new Date($scope.endDate);
                var startCurrentDate = currentStart.getFullYear() + '-' + (currentStart.getMonth() + 1) + '-' + currentStart.getDate();
                var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
                console.log(currentStart,endCurrentDate);
                var postJson = {
                    storeId : X_context.storeId,
                    startDate : (startCurrentDate == "NaN-NaN-NaN") ? null : startCurrentDate,
                    endDate : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate,
                    name : $scope.couponName,
                    type : 0,
                    amount : $scope.amount
                };
                var products = [];
                _.forEach($scope.currentList, function(product) {
                    var prod = {
                        productId : product.id || product._id,
                        productName : product.name,
                        productSn : product.sn
                    };
                    products.push(prod);
                });
                postJson.products = products;
                $http.post(newCouponApi,postJson)
                    .success(function(){
                        $state.transitionTo('couponList');
                    }).error(function(resp){
                        $rootScope.$broadcast('alerts',{type:'danger',message: resp.message});
                    })
            });


    };

    $scope.$watch('allSelected',function(){
        _.forEach($scope.currentShoppingList,function(item,key){
            item.addMark = $scope.allSelected;
        })
    });

    //$scope.checkHasAddAccounts = function(){
    //    if( _.filter($scope.currentShoppingList,{addMark:true}).length ==0){
    //        $scope.hasAddAccounts = false;
    //    }else{
    //        $scope.hasAddAccounts = true;
    //    }
    //}

    $scope.addProduct = function(){
        var products = _.cloneDeep(_.filter($scope.currentShoppingList,{addMark : true}));
        _.forEach(products,function(product,i){
            if(_.find($scope.currentList,{id : product.id}))return;
            $scope.currentList.push(product);
        });
    };

    $scope.$watch('selected',function(){
        _.forEach($scope.currentList,function(item,key){
            item.deleteMark = $scope.selected;
        })
    });

    $scope.deleteProduct = function(){
        $scope.currentList =  _.dropWhile($scope.currentList, {deleteMark: true});
    };


    //date
    $scope.former = function() {
        $scope.startDate = new Date();
    };
    $scope.former();

    $scope.afterward = function() {
        $scope.endDate = new Date(((new Date()).getTime() + 7*24*60*60*1000));
    };
    $scope.afterward();

    $scope.clear = function () {
        $scope.startDate = null;
        $scope.endDate = null;
    };

    // Disable weekend selection
    //$scope.disabled = function(date, mode) {
    //    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    //};

    $scope.maxDate = new Date(2020, 5, 22);

    $scope.openStart = function($event) {
        $scope.status.openedStart = true;
    };

    $scope.openEnd = function($event) {
        $scope.status.openedEnd = true;
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    $scope.status = {
        openedStart : false,
        openedEnd : false
    };

});

