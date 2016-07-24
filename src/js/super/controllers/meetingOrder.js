/**
 * Created by qishi on 16/1/8.
 */
"use strict";
angular.module('ZJSY_SuperAdmin').controller('MeetingOrderController', function($scope,$http,$stateParams,$state,$location,$q,$rootScope){

    $scope.currentPage = 1;
    if($location.search().page) {
        $scope.currentPage = $location.search().page;
    } else {
        $scope.currentPage = 1;
        $location.search({'page': 1});
    }

    $scope.pageSize = 20;
    $scope.pageNum = null;
    $scope.currentMeetingList = [];
    $scope.currentOrderList = [];
    $scope.timeList = [];
    $scope.currentTimeList = [];
    $scope.orderHandle = null;
    $scope.orderRemove = null;
    $scope.disableHandle = true;
    $scope.countTotal = null;
    $scope._ = _;


    var timeListApi = X_context.api + "meeting/listAllTime";
    var meetingListApi = X_context.api + "meeting/listRooms";
    var orderListApi = X_context.api + "meeting/listOrder";
    var orderManageApi = X_context.api + "meeting/cancelRent";
    var payRefundApi = X_context.api + "pay/meetingRefund";

    $scope.timeList = [
        {
            name :  "8点",
            id : "8"
        },
        {
            name :  "9点",
            id : "9"
        },
        {
            name :  "10点",
            id : "10"
        },
        {
            name :  "11点",
            id : "11"
        },
        {
            name :  "12点",
            id : "12"
        },
        {
            name :  "13点",
            id : "13"
        },
        {
            name :  "14点",
            id : "14"
        },
        {
            name :  "15点",
            id : "15"
        },
        {
            name :  "16点",
            id : "16"
        },
        {
            name :  "17点",
            id : "17"
        },
        {
            name :  "18点",
            id : "18"
        },{
            name :  "晚上",
            id : "晚上"
        }
    ];

    //date
    $scope.today = function() {
        $scope.endDate = new Date();
    };
    $scope.today();

    $scope.former = function() {
        $scope.startDate = new Date((new Date()- 30*24*60*60*1000));
    };
    $scope.former();

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


        var meetingListPromise = $http.post(meetingListApi,{

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentMeetingList = data.data || [];
                $scope.currentMeetingList = currentMeetingList;

            });

    function getPageData(){
        var currentEnd = new Date($scope.endDate);
        var endCurrentDate = currentEnd.getFullYear().toString() + '-' + (currentEnd.getMonth() + 1).toString() + '-' + currentEnd.getDate().toString();
        console.log("end",endCurrentDate);

        var timeListPromise = $http.post(timeListApi,{
            "meetingDate" : (endCurrentDate == "NaN-NaN-NaN") ? null : endCurrentDate

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentTimeList = data.data || [];
                $scope.currentTimeList = currentTimeList;

            });

        $q.all([meetingListPromise,timeListPromise]).then(function(datas){
            //console.log("data",datas);
            //console.log("datas",$scope.currentMeetingList);
            //console.log("datas",$scope.currentTimeList);
            _.forEach($scope.currentMeetingList,function(room,i){
                var allTimeList = [];
                allTimeList = _.filter($scope.currentTimeList,{roomId : room.id});
                allTimeList = _.pluck(allTimeList,'meetingTime');
                var output = [];
                _.forEach(allTimeList,function(time,i){
                    output = _.union(output,time.split(','));
                });
                room.allTimeList = output;
            });

        });

    }

    getPageData();
    $scope.getPageData = getPageData;


    function getOrder(one){

        $http.post(orderListApi,{
            page : $scope.currentPage,
            pageSize : $scope.pageSize

        })
            .success(function(data){
                $location.search({'page': $scope.currentPage});
                var currentOrderList = data.data || [];
                $scope.currentOrderList = currentOrderList;
                if((one==false) && data.data.length == 0)
                {
                    $rootScope.$broadcast('alerts',{type:'danger',message:"未找到相关订单，请正确输入信息后重试！"});
                    $scope.total = 0;
                    $scope.pageNum = 0;
                }
                if(data.data.length != 0){
                    $scope.total = data.data[0].total;
                    $scope.pageNum = ($scope.total  && currentOrderList.length >= 1)
                        ? Math.ceil($scope.total / $scope.pageSize)
                        : 1;
                }
                if((one==true) && data.data.length == 0)
                {
                    $scope.total = 0;
                    $scope.pageNum = 0;
                }
            });
    }
    getOrder(true);
    $scope.getOrder = getOrder;

    $scope.$watch('currentPage',function(){
        getOrder();
    });

    $scope.setCurrentPage = function(index){
        $scope.currentPage = index;
        $(window).scrollTop(0);
    }
    $scope.isCurrentPage = function(index){
        return $scope.currentPage == index;
    }

    $scope.setDeleteAccount = function(id,paySn){
        $scope.orderRemove = id;
        $scope.paySn = paySn;
    }


    $scope.orderCancel = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderRemove,
            "orderStatus" : "2"
        }).success(function(){
            getPageData();
            getOrder();
            if($scope.paySn){
                console.log($scope.paySn);
                $http.post(payRefundApi,{
                    "orderId" : $scope.orderRemove
                }).success(function(){
                    getPageData();
                });
            }
        }).error(function(data){
            if(data.code == 500){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"超过预定时间，不能取消！"});
            }
        })
    };

    //$scope.payRefund = function(id){
    //    console.log($scope.paySn);
    //    if($scope.paySn){
    //        console.log($scope.paySn);
    //        $http.post(payRefundApi,{
    //            "orderId" : $scope.orderRemove
    //        }).success(function(){
    //            getPageData();
    //        });
    //    }
    //
    //}


    $scope.setHandle = function(id){
        $scope.orderHandle = id;
    }

    $scope.handle = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderHandle,
            "orderStatus" : "1"

        }).success(function(){
            getPageData();
            getOrder();
        }).error(function(data){
            if(data.code == 500){
                return $rootScope.$broadcast('alerts',{type:'danger',message:"此会议室已被预订，不能处理！"});
            }
        })
    }

    $scope.setPaidAccount = function(id){
        $scope.orderPaid = id;
    }

    $scope.orderPay = function(id){

        $http.post(orderManageApi,{
            "orderId" : $scope.orderPaid,
            "payStatus" : 'true'
        }).success(function(){
            getPageData();
            getOrder();
            console.log($scope.orderPaid);
        });
    }




});
