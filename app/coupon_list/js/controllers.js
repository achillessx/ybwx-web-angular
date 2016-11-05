'use strict';

/* Controllers */

var shareUrl = 'http://web.youbaowuxian.com/wx_share.html';
var wxListControllers = angular.module('wxListControllers', []);

wxListControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		$scope.init = function() {
			weixinShareUtil.share(shareUrl);
		}
		$scope.goDetail = function(){
			$location.path('/detail');
		}
		$scope.tog="1";
		$scope.init();
	}
]);

wxListControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location',
	function($scope, $routeParams, $location) {
		$scope.init = function() {
				weixinShareUtil.share(shareUrl);
			}
			//$scope.init();
	}
]);

