'use strict';

/* Controllers */

var shareUrl = 'http://web.youbaowuxian.com/wx_share.html';
var wxListControllers = angular.module('wxListControllers', []);
var api = {
	'get_insurances':'/ybwx-web/api/insurance_orders',
	'send_bd': '/ybwx-web/api/send_policy',
	'get_insurance_detail':'/ybwx-web/api/insurance_order'
}
var insuranceMap={
	'4':'待投保',
	'6':'已投保',
	'7':'投保失败'
}
function genDate(dateString){
	if(dateString && dateString.length>0){
		if(dateString.length===8){
			return new Date(dateString.substring(0,4),dateString.substring(4,6),dateString.substring(6,8));
		}
		if(dateString.length===14){
			return new Date(dateString.substring(0,4),dateString.substring(4,6),dateString.substring(6,8),dateString.substring(8,10),dateString.substring(10,12),dateString.substring(12,14));
		}
	}
	new Date(year, month, day, hours, minutes, seconds);
}
wxListControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location','$http','$rootScope',
	function($scope, $routeParams, $location,$http,$rootScope) {
        $scope.init = function() {
	        weixinShareUtil.share(shareUrl,true).then(function(){
	        var openId = sessionStorage.getItem("openId");
	        //$scope.reason="您没有领取任何优惠券。";
	       // $("#reason_container").show();
	          $http({
	                method: 'POST',
	                headers: {
	                  "Content-Type": "application/json;charset:UTF-8"
	                },
	               url: api['get_insurances'],
	                data: {
	                  "open_id": openId
	                }
	              }).then(function(res) {
	                 console.log(res);
	                 if(res.data && res.data.description){
	                     util.showToast($rootScope,res.data.description);
	                   //  $(".default_text").show();
	                 }

	                 if(res.data.code==0){
	                    if(res.data.data.orders){
	                        /**/
	                          res.data.data.orders.forEach(function(item){
	                             // item.showDate = item["expiry_date"].substring(0,4)+"-"+item["expiry_date"].substring(4,6)+"-"+item["expiry_date"].substring(6);
	                              item.order_status_text=insuranceMap[item["order_status"]];
	                             
	                          })
	                          $scope.reason="";
	                          console.log( res.data.data.orders);
	                          $scope.orders=res.data.data.orders;
	                          $(".ul_container").show();
	                    }
	                 }
	              }, function(res) {
	                 console.log(res);
	                 util.showToast($rootScope,"服务器错误");
	                // $(".default_text").show();
	              });
	            })
    	 }

    	 $scope.filterFn = function(order){
    	 			if($scope.tog===""){
    	 				return true;
    	 			}
    	 			console.log(order.order_status)
    	 			console.log($scope.tog)
    	 			console.log(order.order_status === $scope.tog);
				    return parseInt(order.order_status) === parseInt($scope.tog);
		};

		$scope.goDetail = function(order_no){
			$location.path('/detail').search({'order_no':order_no});
		}
		$scope.tog="";
		$scope.init();
	}
]);

wxListControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location','$http','$rootScope',
	function($scope, $routeParams, $location,$http,$rootScope) {
		console.log($routeParams.order_no);
		$scope.init = function() {
	        var openId = sessionStorage.getItem("openId");
	        //$scope.reason="您没有领取任何优惠券。";
	       // $("#reason_container").show();
	          $http({
	                method: 'POST',
	                headers: {
	                  "Content-Type": "application/json;charset:UTF-8"
	                },
	               url: api['get_insurance_detail'],
	                data: {
	                  "open_id": openId,
	                  'order_no':$routeParams.order_no
	                }
	              }).then(function(res) {
	                 console.log(res);
	                 if(res.data && res.data.description){
	                     util.showToast($rootScope,res.data.description);
	                 }
	                 if(res.data.code==0){
	                 	    res.data.data.order.order_status_text=insuranceMap[res.data.data.order["order_status"]];
	                		$scope.order=res.data.data.order;
	                 }
	              }, function(res) {
	                 console.log(res);
	                 util.showToast($rootScope,"服务器错误");
	              });
		}

		$scope.send_bd = function() {
			if (!sendForm.email.$invalid) {
				var openId = sessionStorage.getItem("openId");
				util.sendMail($http,$rootScope,api['send_bd'],openId,$scope.user.email, $location.search().order_no);
				$scope.hideDialog();
			}
		}
		$scope.showDialog = function(){
			$("#email_dialog").show();
		}
		$scope.hideDialog = function(){
			$("#email_dialog").hide();
		}
		$scope.init();
	}
]);

