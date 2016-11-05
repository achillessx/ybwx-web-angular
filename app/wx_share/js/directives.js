'use strict';

/* Directives */
var app = angular.module('ybwx-directives', []);
var CHINESE_REGEXP = /^[\x00-\xff]/;
app.directive('chinese', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$validators.chinese = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (!CHINESE_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }
        // it is invalid
        return false;
      };
    }
  };
});


app.directive('ngcDone', function ($timeout) {  
    return function (scope, element, attrs) {  
        scope.$watch(attrs.ngcDone, function (callback) {  
  
            if (scope.$last === undefined) {  
                scope.$watch('htmlElement', function () {  
                    if (scope.htmlElement !== undefined) {  
                        $timeout(eval(callback), 1);  
                    }  
                });  
            }  
  
            if (scope.$last) {  
                eval(callback)();  
            }  
        });  
    }  
});  