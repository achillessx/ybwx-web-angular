'use strict';

/* App Module */

var ybwxApp = angular.module('ybwxApp', [
  'ngRoute',
  'ngCookies',
  'ybwx-directives',
  'ybwxControllers'
]);

ybwxApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/index', {
    templateUrl: 'partials/index_part.html?v=123',
    controller: 'ybwxIndexCtrl'
  }).when('/select',{
    templateUrl: 'partials/select_part.html?v=123',
    controller: 'ybwxSelectCtrl'
  }).when('/bz',{
    templateUrl: 'partials/bz_list.html?v=123',
    controller: 'ybwxBzCtrl'
  }).when('/pay_select',{
    templateUrl: 'partials/pay_select.html?v=123',
    controller: 'ybwxPaySelectCtrl'
  }).when('/tb',{
    templateUrl: 'partials/toubao.html?v=123',
    controller: 'ybwxToubaoCtrl'
  }).when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'ybwxLoginCtrl'
  }).when('/register', {
    templateUrl: 'partials/register.html',
    controller: 'ybwxRegCtrl'
  }) .when('/share', {
    templateUrl: 'partials/share.html',
    controller: 'ybwxShareCtrl'
  }) .when('/test', {
    templateUrl: 'partials/test.html',
    controller: 'ybwxTestCtrl'
  }) .when('/pay', {
    templateUrl: 'partials/pay-test.html?v=222',
    controller: 'ybwxPayCtrl'
  }).when('/list', {
    templateUrl: 'partials/list.html',
    controller: 'wxListCtrl'
  }).when('/detail', {
    templateUrl: 'partials/detail.html',
    controller: 'wxDetailCtrl'
  }).when('/success', {
    templateUrl: 'partials/success.html',
    controller: 'ybwxSuccessCtrl'
  }).otherwise({
  redirectTo: '/index'
});
}]);