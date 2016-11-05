'use strict';

/* Controllers */


var wxShareControllers = angular.module('wxShareControllers', []);

var shareUrl = 'http://web.youbaowuxian.com/wx_share.html';
var api = {
	"saveBd": "/ybwx-web/api/use_coupon",
	'addCoupon': '/ybwx-web/api/add_coupon',
	'payRequest': "/ybwx-diplomat/ipaynow/pay_request",
	'getCoupons': '/ybwx-web/api/get_coupons',
	'addFreeBd': '/ybwx-web/api/use_coupon',
	'send_bd': '/ybwx-web/api/send_policy',
	'ping_coupon': '/ybwx-web/api/ping_coupon',
	"test": "/ybwx-web/api/test"
}

function shareTip() {
	$("#share").show();
}



function submitBd($scope, $http, $location, $filter) {
	var openId = localStorage.getItem("openId");
	var insuranceDate = $filter('date')($scope.user.insurance_date, "yyyyMMdd");
	return $http({
		method: 'POST',
		headers: {
			"Content-Type": "application/json;charset:UTF-8"
		},
		url: api['saveBd'],
		data: {
			coupon_no: $scope.coupon_no,
			open_id: openId,
			username: $scope.user.username,
			social_id: $scope.user.social_id,
			mobile: $scope.user.mobile,
			insure_date: insuranceDate
		}
	})

}

wxShareControllers.controller('wxShareBdCtrl', ['$scope', '$filter', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $filter, $routeParams, $http, $location, $rootScope) {

		$scope.coupon_no = $routeParams.coupon_no;
		var testDate = new Date();
		testDate.setDate(testDate.getDate() + 1);
		$scope.minDate = testDate;
		var userinfo = JSON.parse(localStorage.getItem('userinfo'));
		if(userinfo){
			$scope.user = {
					username: userinfo.username,
					social_id: userinfo.social_id,
					mobile: userinfo.mobile
			}
		}else{
			$scope.user = {};
		}
		$scope.user.know_contract=true;
		//saveBd($http,"张三","411202198509190511","18910873024");
		$scope.server_reason = "";
		var openId = localStorage.getItem("openId");

		

		$scope.submit = function() {

			if (!$scope.registration.$invalid) {
				$("#loadingToast").show();
				//util.showToast($rootScope,"正在提交,请稍后.....");
				localStorage.setItem('userinfo',
						JSON.stringify({
							username: $scope.user.username,
							social_id: $scope.user.social_id,
							mobile: $scope.user.mobile
						}));

				submitBd($scope, $http, $location, $filter).then(function(res) {
					console.log(res);
					$("#loadingToast").hide();
					//$("#loading").hide();
					if (res.data.code === 0) {
						var orderId = res.data.data.order_no;
						console.log(res);
						console.log("orderId:" + orderId);
						$location.path('/success/').search({
							"order_no": orderId
						});;
					}
					if (res && res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					}
				}, function(res) {
					//$("#loading").hide();
					$("#loadingToast").hide();
					$scope.server_reason = "服务器出错";
					console.log(res);
				});

			}else{
				if($scope.registration.insurance_date.$error.required){
						util.showToast($rootScope, "保障日期必填");
				}	
			}
		}

	}
]);



wxShareControllers.controller('wxShareSuccessCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
	function($scope, $routeParams, $location, $http, $rootScope) {
		//sessionStorage
		$scope.orderId = $location.search().order_no;
		$scope.send_bd = function() {
			if (!sendForm.email.$invalid) {
				var openId = localStorage.getItem("openId");
				util.sendMail($http,$rootScope,api['send_bd'],openId,$scope.user.email, $location.search().order_no);
				
			}
		}
		$scope.goList = function() {
			window.location.href = "wx_list.html"
		}
		$scope.showShareTip = function() {
			shareTip();
		}
	}
]);


wxShareControllers.controller('wxSharesuccessCouponCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		//sessionStorage
		$scope.count = $routeParams.count;
		$scope.showShareTip = function() {
			shareTip();
		}
	}
]);


wxShareControllers.controller('wxShareIndexCtrl', ['$scope', '$routeParams', '$http', '$location', '$rootScope',
	function($scope, $routeParams, $http, $location, $rootScope) {

		$scope.init = function() {
			$scope.data = {
				remain_times: 1,
				recommend_times: 0
			}
			weixinShareUtil.share(shareUrl).then(function() {
				var openId = localStorage.getItem("openId");
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: api['ping_coupon'],
					data: {
						"open_id": openId,
						"coupon_id": "1"
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						$scope.data = res.data.data;
						//console.log($scope.data);
						if(res.data.data.recommend_times>0){
								$("#coupons_container").show();
						}
					}
					// showToast($rootScope,res.data.description);
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
			})
		}
		$scope.init();
		$scope.addCoupon = function() {
			var openId = localStorage.getItem("openId");
			$http({
				method: 'POST',
				headers: {
					"Content-Type": "application/json;charset:UTF-8"
				},
				url: api['addCoupon'],
				data: {
					"open_id": openId,
					"r_open_id": recId,
					"coupon_id": "1"
				}
			}).then(function(res) {
				console.log(res);
				if (res.data && res.data.description) {
					util.showToast($rootScope, res.data.description);
				}
				// showToast($rootScope,res.data.description);
				if (res.data.code == 0) {
					$location.path('/success_coupon').search({
						count: (res.data.data["coupon_counts"] + 1)
					});
				}
			}, function(res) {
				console.log(res);
				util.showToast($rootScope, "服务器错误");
			});
		}

		$scope.freeBd = function() {
			$location.path('/freebd');
		}
		$scope.payBd = function() {
			$location.path('/paybd');
		}

		$scope.showShareTip = function() {
			shareTip();
		}
	}
]);


/*
wxShareControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		$scope.init = function() {
			weixinShareUtil.share(shareUrl);
		}
		$scope.goDetail = function() {
			$location.path('/detail');
		}
		$scope.tog = "1";
		$scope.init();
	}
]);

wxShareControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		$scope.init = function() {
			weixinShareUtil.share(shareUrl);
		}
		//$scope.init();
	}
]);


wxShareControllers.controller('wxSharePayBdCtrl', ['$scope', '$filter', '$routeParams',  '$http','$location',
	function($scope, $filter,$routeParams,$http, $location) {

		$scope.user = {
				insurance_date: new Date(),
		}
		$scope.ngcready = function(){
			console.log('ngcready...');
		}

		//获得支付信息
		 $scope.payRequest = function(){
		   var openId = localStorage.getItem("openId");
	       $http({
	          method: 'POST',
	          headers: {
	            "Content-Type": "application/json;charset:UTF-8"
	          },
	         url: api['payRequest'],
	          data: {
	            "wechat_open_id": openId,
	            "order_amount": "1"
	          }
	        }).then(function(res) {
	          console.log(res);
	          $("#loading").hide();
	          if (res.data.code == 0) {
	              $scope.data = res.data.data;
	              //提交支付
	              setTimeout(function(){
	              	//document.getElementById("payForm").submit();
	              },10);
	          }
	        }, function(res) {
	          console.log(res);
	        });
		 }
	    $scope.submit = function() {
	    		$scope.server_reason="";
	    		$("#loading").show();
				submitBd($scope,$http,$location,$filter).then(function(res) {
				
					console.log(res);
					if (res.data.code == 0) {
							  $scope.payRequest();
					}else{
							$("#loading").hide();
						//展示错误信息
						if (res.data.reason) {
							$scope.server_reason = res.data.reason;
						} else {
							$scope.server_reason = res.data.description;
						}
					}
				}, function(res) {
					$("#loading").hide();
					console.log(res);
				});	
		}
	}
]);
*/