'use strict';

/* App Module */

var wxListApp = angular.module('wxListApp', [
  'ngRoute',
  'wxListControllers'
]);
wxListApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider
  .when('/list', {
    templateUrl: 'wx_list/partials/list_part.html?v=xxx',
    controller: 'wxListCtrl'
  }) .when('/detail', {
    templateUrl: 'wx_list/partials/detail_part.html?v=123',
    controller: 'wxDetailCtrl'
  }).otherwise({
    redirectTo: '/list'
  });

}]);