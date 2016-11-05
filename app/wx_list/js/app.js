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
    templateUrl: 'wx_list/partials/list_part.html',
    controller: 'wxListCtrl'
  }) .when('/detail', {
    templateUrl: 'wx_list/partials/detail_part.html',
    controller: 'wxDetailCtrl'
  }).otherwise({
    redirectTo: '/list'
  });

}]);