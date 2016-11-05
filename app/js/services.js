'use strict';

/* Services */

var ybwxServices = angular.module('ybwxServices', ['ngResource']);

  var api = {
        "sendMsg": "/ybwx-web/user/sendVerCode",
        "register": "/ybwx-web/user/register",
        "ybwxlogin": "/ybwx-web/user/login",
    }

ybwxServices.factory('PhoneVerCode', ['$resource',
  function($resource){
    return $resource(api["sendMsg"]);
  }]);

ybwxServices.factory('register', ['$resource',
  function($resource){
    return $resource(api["register"]);
  }]);


ybwxServices.factory('YbwxLogin', ['$resource',
  function($resource){
    return $resource(api["ybwxlogin"],{},{charge: {method:'POST', params:{charge:true}}});
  }]);