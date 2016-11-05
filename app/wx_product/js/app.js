'use strict';

/* App Module */

var wxProductListApp = angular.module('wxProductListApp', [
  'ngRoute',
  'wxProductListControllers'
]);
wxProductListApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider
  .when('/list', {
    templateUrl: 'wx_product/partials/list.html',
    controller: 'wxListCtrl'
  }).when('/detail', {
    templateUrl: 'wx_product/partials/detail.html',
    controller: 'wxDetailCtrl'
  }).otherwise({
    redirectTo: '/list'
  });

}]);