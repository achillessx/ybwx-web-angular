'use strict';

/* Controllers */

var ybwxControllers = angular.module('ybwxControllers', []);


var api = {
  'get_insurances': '/ybwx-web/api/insurance/selling',
  'get_insurances_detail': '/ybwx-web/api/insurance/plans',
  'get_industries_1': '/ybwx-web/api/industries',
  'get_industries_2': '/ybwx-web/api/occupations/',
  'get_industries_3': '/ybwx-web/api/jobs/',
  'insure': '/ybwx-web/api/insurance/insure',
  'send_bd': '/ybwx-web/api/send_policy',
  'pay': '/ybwx-web/api/pay'
}

ybwxControllers.controller('wxListCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $routeParams, $location, $http, $rootScope) {
    $scope.init = function() {
      $http({
        method: 'POST',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_insurances'],
        data: {
          //"open_id": ""
        }
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          $scope.list = res.data.data.insurances;
        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, "服务器错误");
      });
      var code = util.getParameterByName("code");
      if (!code) {
        code = $routeParams.code;
      }
      util.getOpenId(code); //获得openId
    }
    $scope.goDetail = function(id) {
      $location.path("/detail").search({
        "product_id": id
      });
    }

  }
]);

ybwxControllers.controller('wxDetailCtrl', ['$scope', '$routeParams', '$location', '$http', '$rootScope', '$sce',
  function($scope, $routeParams, $location, $http, $rootScope, $sce) {

    $("#detail-template").load("template/product_" + $routeParams.product_id + ".html");
    // console.log( $scope.template);
    $scope.init = function() {
      // $scope.template = "template/product_"+$routeParams.product_id+".html";
      // $scope.templateHtml = $sce.trustAsHtml(template);
      $scope.selectTable = 0;
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
        if (res && res.data && res.data.data) {
          for(var i=0;i<res.data.data.insurance_plans.length;i++){
              var plan = res.data.data.insurance_plans[i];
              for(var j = 0;j<plan.coverage_beans.length;j++){
                  if(plan.coverage_beans[j].sum_insured.charAt(plan.coverage_beans[j].sum_insured.length-1)==="d"){
                    plan.coverage_beans[j].danwei="/天";
                    plan.coverage_beans[j].sum_insured = plan.coverage_beans[j].sum_insured.substring(0,plan.coverage_beans[j].sum_insured.length-1);
                  }
              }
          }
          $scope.data = res.data.data;
          $scope.money = res.data.data.insurance_plans[0].min_selling_price;
          $scope.plan = res.data.data.insurance_plans[0];
        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, "服务器错误");
      });
    }
    $scope.headSelect = function($event, plan) {
      var element = $event.currentTarget;
      $("#title-table").find("td").removeClass("choose")
      $(element).addClass("choose");
      var index = $(element).attr("data-index");
      $scope.selectTable = index;
      $("#title-table").attr("data-current-select-id", plan.id);
      //console.log($(element));
      $scope.plan = plan;
      $scope.money = plan.min_selling_price;
    }
    /*
    Coverage_Period_Type:
      (0, "保障期间类型未知"),
      (1, "保终身"),
      (2, "按年保"),
      (3, "按年龄限保"),
      (4, "按月保"),
      (5, "按天保");*/
    $scope.submit = function(information_page_id, provision_page_id) {
      //获得当前的plan
      var selectPlan = $("#title-table").attr("data-current-select-id");
      //console.log(selectPlan);
      if($scope.plan.coverage_period_type ===5){
        $scope.danwei=$scope.plan.coverage_period+"天";
      }
       if($scope.plan.coverage_period_type ===2){
        $scope.danwei=$scope.plan.coverage_period+"年";
      }

      $location.path("/tb").search({
        "select-plan": selectPlan,
        "information_page_id": information_page_id,
        "provision_page_id": provision_page_id,
        "money": $scope.money,
        "danwei":$scope.danwei
      });
    }
  }
]);


ybwxControllers.controller('ybwxToubaoCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {

    $scope.money = $routeParams.money;
    $scope.danwei =  $routeParams.danwei;
    function newOption(name) {
      return {
        id: '-1',
        name: '请选择' + name + '级职业分类'
      }
    }

    function getFirstJob() {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_1']
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {

          $scope.data.availableOptions_1 = res.data.data.industries.slice();
          $scope.data.availableOptions_1.unshift(newOption("一"));
          $scope.data.selectedOption_1 = newOption("一");

          $scope.data.availableFamilyOptions_1 = res.data.data.industries.slice();
          $scope.data.availableFamilyOptions_1.unshift(newOption("一"));
          $scope.data.selectedFamilyOption_1 = newOption("一");
    


        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, "服务器错误");
      })
    }

    function baseGetSecondJob(firstJobid, callback) {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_2'] + firstJobid

      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          callback(res);
        }
      });
    }

    function baseGetThirdJob(secondJobid, callback) {
      $http({
        method: 'GET',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['get_industries_3'] + secondJobid

      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data) {
          callback(res);
        }
      });
    }

    $scope.getSecondJob = function() {
      baseGetSecondJob($scope.data.selectedOption_1.id, function(res) {
        $scope.data.availableOptions_2 = res.data.data.occupations;
        $scope.data.availableOptions_2.unshift(newOption("二"));
        $scope.data.selectedOption_2 = newOption("二");
      });
    }
    $scope.getThirdJob = function() {
      baseGetThirdJob($scope.data.selectedOption_2.id, function(res) {
        $scope.data.availableOptions_3 = res.data.data.jobs;
        $scope.data.availableOptions_3.unshift(newOption("三"));
        $scope.data.selectedOption_3 = newOption("三");
      });
    }
    $scope.getFamilySecondJob = function() {
      baseGetSecondJob($scope.data.selectedFamilyOption_1.id, function(res) {
        $scope.data.availableFamilyOptions_2 = res.data.data.occupations;
        $scope.data.availableFamilyOptions_2.unshift(newOption("二"));
        $scope.data.selectedFamilyOption_2 = newOption("二");
      });
    }
    $scope.getFamilyThirdJob = function() {
      baseGetThirdJob($scope.data.selectedFamilyOption_2.id, function(res) {
        $scope.data.availableFamilyOptions_3 = res.data.data.jobs;
        $scope.data.availableFamilyOptions_3.unshift(newOption("三"));
        $scope.data.selectedFamilyOption_3 = newOption("三");
      });
    }



    $scope.init = function() {
      $scope.data = {
        //availableOptions_1: [newOption("一")],
        //selectedOption_1: newOption("一"),
        availableOptions_2: [newOption("二")],
        selectedOption_2: newOption("二"),
        availableOptions_3: [newOption("三")],
        selectedOption_3: newOption("三"),

        //availableFamilyOptions_1: [newOption("一")],
        //selectedFamilyOption_1: newOption("一"),
        availableFamilyOptions_2: [newOption("二")],
        selectedFamilyOption_2: newOption("二"),
        availableFamilyOptions_3: [newOption("三")],
        selectedFamilyOption_3: newOption("三")
      };
      getFirstJob();
      $scope.params = $routeParams;
      var testDate = new Date();
      testDate.setDate(testDate.getDate() + 1);
      $scope.minDate = testDate;
      $scope.know_contract = true;
    }

    function baseValid() {
      if ($scope.order.username.$invalid) {
        util.showToast($rootScope, "姓名不正确");
        return false;
      }
      if ($scope.order.social_id.$invalid) {
        util.showToast($rootScope, "身份证号不正确");
        return false;
      }
      if ($scope.order.mobile.$invalid) {
        util.showToast($rootScope, "手机号不正确");
        return false;
      }

      if ($scope.order.effective_date.$invalid) {
        util.showToast($rootScope, "保险生效时间不正确");
        return false;
      }
      /*
      if ($scope.order.ineffective_date.$invalid) {
        util.showToast($rootScope, "保险终止时间不正确");
        return false;
      }*/
      return true;
    }

    function forSelfSpecial() {
      if ($scope.data.selectedOption_3 && $scope.data.selectedOption_3 === -1) {
        util.showToast($rootScope, "被保人职业选择不正确");
        return false;
      }
      return true;
    }

    function familyValid() {
      if ($scope.order.insurance_username.$invalid) {
        util.showToast($rootScope, "被保人姓名不正确");
        return false;
      }
      if ($scope.order.insurance_social_id.$invalid) {
        util.showToast($rootScope, "被保人身份证不正确");
        return false;
      }
      if ($scope.order.insurance_mobile.$invalid) {
        util.showToast($rootScope, "被保人手机号不正确");
        return false;
      }
      if ($scope.data.selectedFamilyOption_3 && $scope.data.selectedFamilyOption_3 === -1) {
        util.showToast($rootScope, "被保人职业选择不正确");
        return false;
      }

      return true;
    }

    $scope.submitbt = function() {
      var openId = sessionStorage.getItem("openId");
      // util.showToast($rootScope, "服务器错误");
      //var insuranceDate = $filter('date')($scope.user.insurance_date, "yyyyMMdd");
      //console.log("orderForm:" + $scope.order.$invalid);
      //console.log("familyForm:" + $scope.familyForm.$invalid);
      //console.log($scope.user);
      baseValid();
      var dataFor = $("#select_toubao").find(".btn_n_primary").attr("data-for") == "self" ? 1 : 2;
      var effectiveDate = $filter('date')($scope.user.effective_date, "yyyyMMdd");
     // var ineffectiveDate = $filter('date')($scope.user.ineffective_date, "yyyyMMdd");
      console.log($routeParams);
      if (dataFor == 1) {
        //为自己
        if (baseValid() && forSelfSpecial()) {
          $http({
            method: 'POST',
            headers: {
              "Content-Type": "application/json;charset:UTF-8"
            },
            url: api['insure'],
            data: {
              open_id: openId,
              name: $scope.user.username,
              social_id: $scope.user.social_id,
              mobile: $scope.user.mobile,
              insurance_plan_id: $routeParams["select-plan"],
              order_amount: $scope.money,
              insure_type: dataFor,
              job_id: $scope.data.selectedOption_3.id,
              effective_date: effectiveDate
            //  ineffective_date: ineffectiveDate
            }
          }).then(function(res) {
            console.log(res);
            if (res && res.data && res.data.data) {
              $location.path("/pay_select").search({
                "insurance_name": res.data.data.insurance_name,
                "insurance_plan_name": res.data.data.insurance_plan_name,
                "order_amount": res.data.data.order_amount,
                "order_id": res.data.data.order_id,
                "order_no": res.data.data.order_no
              });
            } else {
              util.showToast($rootScope, res.data.description);
            }
          }, function(res) {
            console.log(res);
            util.showToast($rootScope, "服务器错误");
          });
        }
      } else {
        //为家人
        if (baseValid() && familyValid()) {
          $http({
            method: 'POST',
            headers: {
              "Content-Type": "application/json;charset:UTF-8"
            },
            url: api['insure'],
            data: {
              open_id: openId,
              name: $scope.user.username,
              social_id: $scope.user.social_id,
              mobile: $scope.user.mobile,
              insurance_plan_id: $routeParams["select-plan"],
              order_amount: $scope.money,
              insure_type: dataFor,
              job_id: $scope.data.selectedOption_3.id,
              effective_date: effectiveDate,
            //  ineffective_date: ineffectiveDate,
              "insured_peoples": [{
                "name": $scope.family.insurance_username,
                "mobile": $scope.family.insurance_mobile,
                "social_id": $scope.family.insurance_social_id,
                "job_id": $scope.data.selectedFamilyOption_3.id
              }]
            }
          }).then(function(res) {
            console.log(res);
            if (res && res.data && res.data.data) {
              $location.path("/pay_select").search({
                "insurance_name": res.data.data.insurance_name,
                "insurance_plan_name": res.data.data.insurance_plan_name,
                "order_amount": res.data.data.order_amount,
                "order_id": res.data.data.order_id,
                "order_no": res.data.data.order_no
              });
            } else {
              util.showToast($rootScope, res.data.description);
            }
          }, function(res) {
            console.log(res);
            util.showToast($rootScope, "服务器错误");
          });
        }
      }



    }

  }
]);


ybwxControllers.controller('ybwxPaySelectCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {
    $scope.insurance_name = $routeParams.insurance_name;
    $scope.insurance_plan_name = $routeParams.insurance_plan_name;
    //    $scope.order_amount = $routeParams.order_amount;
    $scope.order_amount = 1;
    $scope.order_id = $routeParams.order_id;
    $scope.order_no = $routeParams.order_no;

    $scope.submit = function() {
      //console.log("submit....");
      var channelType = $(".pay_container").find(".choose").attr("data-channel-type");

      if (channelType == "1") { //银行卡支付
        if ($scope.redirectUrl) {

          window.location.href = $scope.redirectUrl;
        } else {
          util.showToast($rootScope, "银行卡支付出错，暂时无法使用");
        }
        //   window.location.href =  $scope.redirectUrl;
      } else if (channelType == "3") { //现在支付微信
        document.getElementById("wechatPayForm").submit();
      }

    }

    $scope.pay = function($event) {
      if ($event) {
        var element = $event.currentTarget;
        $(".pay_item").removeClass("choose");
        $(element).addClass("choose");
      }
      var openId = sessionStorage.getItem("openId");
      var channelType = $(".pay_container").find(".choose").attr("data-channel-type");

      if (channelType == "1" && $scope.redirectUrl) {
        return;
      }
      if (channelType == "3" && $scope.ipaynow_pay_request) {
        return;
      }
      $http({
        method: 'POST',
        headers: {
          "Content-Type": "application/json;charset:UTF-8"
        },
        url: api['pay'],
        data: {
          open_id: openId,
          order_id: $scope.order_id,
          pay_channel_type: channelType,
          order_amount: $scope.order_amount,

        }
      }).then(function(res) {
        console.log(res);
        if (res && res.data && res.data.data && res.data.code === 0) {
          if (channelType == "1") { //银行卡
            //window.location.href = res.data.data.pp_response.pp_url;
            $scope.redirectUrl = res.data.data.pp_response.pp_url;
          } else if (channelType == "3") { //现在支付微信
            $scope.ipaynow_pay_request = res.data.data.ipaynow_pay_request;
          }
        } else {
          util.showToast($rootScope, res.data.reason);
        }
      }, function(res) {
        console.log(res);
        util.showToast($rootScope, res.description);
      });
    }
    $scope.pay();
  }
]);


ybwxControllers.controller('ybwxSuccessCtrl', ['$scope', '$filter', '$routeParams', '$location', '$http', '$rootScope',
  function($scope, $filter, $routeParams, $location, $http, $rootScope) {

    //sessionStorage
    //$scope.orderId = $location.search().order_no;
    $scope.send_bd = function() {
      if (!sendForm.email.$invalid) {
        var openId = sessionStorage.getItem("openId");
        util.sendMail($http, $rootScope, api['send_bd'], openId, $scope.user.email, $location.search().order_no);

      }
    }
    $scope.goList = function() {
      window.location.href = "wx_list.html";
    }
    $scope.showShareTip = function() {
      shareTip();
    }
  }
]);

ybwxControllers.controller('ybwxIndexCtrl', ['$scope',
  function($scope) {
    $scope.hello = 'helloWorld';
  }
]);
ybwxControllers.controller('ybwxSelectCtrl', ['$scope',
  function($scope) {
    $scope.hello = 'helloWorld';
  }
]);

ybwxControllers.controller('ybwxBzCtrl', ['$scope',
  function($scope) {
    $scope.hello = 'helloWorld';
  }
]);



ybwxControllers.controller('ybwxProductdListCtrl', ['$scope',
  function($scope) {
    $scope.hello = 'helloWorld';
  }
]);



/*
ybwxControllers.controller('ybwxLoginCtrl', ['$scope', 'YbwxLogin', '$cookies','$location','$interval',
  function($scope, YbwxLogin, $cookies,$location,$interval) {

    $scope.submit_server_reason = "";
    $cookies.put("234234xx","xxxx");
    console.log($cookies.get("JSESSIONID"));
    if ($cookies.get("JSESSIONID")) {
      $scope.submit_server_reason = "已经登录成功";
    }
    $scope.login = function() {
      if ($scope.loginform.$invalid) {
        return false;
      }
       $scope.submit_server_reason = "正在登录，请稍等";
      YbwxLogin.save($scope.user, {}, function(resp) {
        // 
         redirectIndex($scope,$interval,$location,"登录成功");

      }, function(err) {
        console.log(err);
        console.log(err.status);
        if(err){
            if(err.status===401){
                 $scope.submit_server_reason = "用户名，密码错误。请重新输入";
            }else{
                 $scope.submit_server_reason = "服务器端错误";
            }
        }
      });
    }
    
  }
]);

function redirectIndex($scope,$interval,$location,successReason){

      var time = 5;
      var timer = $interval(function() {
        time--;
        $scope.submit_server_reason = successReason+time + "秒后跳转首页";
        if (time === 0) {
          $scope.submit_server_reason =successReason + ",跳转首页";
          $interval.cancel(timer);
           //location.href = "/#/index";
           $location.path('/index');
        }
      }, 1000)
}
ybwxControllers.controller('ybwxRegCtrl', ['$scope', '$interval', 'PhoneVerCode', 'register','$location',
  function($scope, $interval, PhoneVerCode, register,$location) {

    $scope.status = "获取验证码";
    $scope.vercode_server_reason = "";
    $scope.submit_server_reason = "";
    $scope.isWaiting = false;
    // Function to replicate setInterval using $timeout service.
    $scope.intervalFunction = function() {
      if ($scope.isWaiting || ($scope.registration.mobile.$invalid)) {
        return false;
      }
      PhoneVerCode.get({
        "mobile": $scope.user.mobile
      }, function(resp) {
        console.log(resp);
        if (resp.description) {
          $scope.vercode_server_reason = "验证码,服务端错误.";
        }
      }, function(err) {
        $scope.vercode_server_reason = "验证码,服务器端错误";
      });
      var time = 30;
      var timer = $interval(function() {
        $scope.isWaiting = true;
        time--;
        $scope.status = time + "秒";
        if (time === 0) {
          $scope.status = "获取验证码";

          $interval.cancel(timer);
          $scope.isWaiting = false;
        }
      }, 1000)
    };
   
    $scope.sendVerify = function() {
      $scope.intervalFunction();
    }
    $scope.submit = function() {
      console.log("is form Ok?" + !$scope.registration.$invalid);
      if (!$scope.registration.$invalid) {
        console.log($scope.user);
        register.get($scope.user, function(resp) {
          if (resp.code === 10000) {
            $scope.submit_server_reason = "验证码已被使用，请重新发送验证码";
          }
          console.log(resp);
          if (resp.code === 0) {
             redirectIndex($scope,$interval,$location,"注册成功");
            //success
            //  显示注册成功
            // location.href = "/#/login";
          }
        }, function(err) {

          $scope.submit_server_reason = "服务器端错误";

        });
      }
    }
  }
]);




ybwxControllers.controller('ybwxPayCtrl', ['$scope', '$http',
  function($scope,$http) {

    $scope.init = function(){
       $http({
          method: 'POST',
          headers: {
            "Content-Type": "application/json;charset:UTF-8"
          },
          url: "/ybwx-diplomat/ipaynow/pay_request",
          data: {
            "wechat_open_id": "18612037939",
            "order_amount": "10"
          }
        }).then(function(res) {
          console.log(res);
          if (res.data.code == 0) {
              $scope.data = res.data.data;
          }
        }, function(res) {
          console.log(res);
        });
    }
     $scope.init();
    $scope.submit = function(){
      console.log("submit....");
        document.getElementById("myForm").submit();
    }
}
]);
*/