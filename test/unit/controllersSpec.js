'use strict';

/* jasmine specs for controllers go here */




describe('ybwx controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('ybwxApp'));
  beforeEach(module('ybwxServices'));



  describe('ybwxRegCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller,$interval) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET("/ybwx-web/sendVerCode").
          respond([{code:"602542"}]);
      scope = $rootScope.$new();
      ctrl = $controller('ybwxRegCtrl', {$scope: scope});
         scope.registration= {};
      //scope.registration.phone="13810597328";
    }));


    it('should create "phones" model with 2 phones fetched from xhr', function() {
      expect(scope.status).toEqualData("获取验证码");
      expect(scope.isWaiting).toEqualData(false);

     // scope.sendVerify();
      //$httpBackend.flush();
      /*
      expect(scope.phones).toEqualData(
          [{code:"602542"}]);
      */
    });

/*

    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('age');
    });*/
  });

});







/*
describe('PhoneCat controllers', function() {

  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('phonecatApp'));
  beforeEach(module('phonecatServices'));

  describe('PhoneListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/phones.json').
          respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);

      scope = $rootScope.$new();
      ctrl = $controller('PhoneListCtrl', {$scope: scope});
    }));


    it('should create "phones" model with 2 phones fetched from xhr', function() {
      expect(scope.phones).toEqualData([]);
      $httpBackend.flush();

      expect(scope.phones).toEqualData(
          [{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
    });


    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('age');
    });
  });


  describe('PhoneDetailCtrl', function(){
    var scope, $httpBackend, ctrl,
        xyzPhoneData = function() {
          return {
            name: 'phone xyz',
                images: ['image/url1.png', 'image/url2.png']
          }
        };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());

      $routeParams.phoneId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller('PhoneDetailCtrl', {$scope: scope});
    }));


    it('should fetch phone detail', function() {
      expect(scope.phone).toEqualData({});
      $httpBackend.flush();

      expect(scope.phone).toEqualData(xyzPhoneData());
    });
  });
});

*/
