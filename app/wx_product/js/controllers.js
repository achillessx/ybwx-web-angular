'use strict';

/* Controllers */

var wxProductListControllers = angular.module('wxProductListControllers', []);

var api = {
	'get_insurances': '/ybwx-web/api/insurance/selling',
	'get_insurances_detail': '/ybwx-web/api/insurance/plans'
}

wxProductListControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
function($scope, $routeParams, $location, $http, $rootScope) {
	$scope.init = function() {
		$http({
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset:UTF-8"
			},
			url: api['get_insurances'],
			data: {
				"open_id": ""
			}
		}).then(function(res) {
			console.log(res);
			if(res && res.data && res.data.data){
				$scope.list = res.data.data.insurances;
			}
		}, function(res) {
			console.log(res);
			util.showToast($rootScope, "服务器错误");
		});
	}
	$scope.goDetail = function(id){
		$location.path("/detail").search({"product_id":id}
		);
	}

}]);
wxProductListControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
function($scope, $routeParams, $location, $http, $rootScope) {
	console.log();
	$scope.init = function() {
		$http({
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset:UTF-8"
			},
			url: api['get_insurances_detail'],
			data: {
				"insurance_id": $routeParams.product_id
			}
		}).then(function(res) {
			console.log(res);
			if(res && res.data && res.data.data){
				$scope.data = res.data.data;
			}
		}, function(res) {
			console.log(res);
			util.showToast($rootScope, "服务器错误");
		});
	}
	$scope.init();

}]);

