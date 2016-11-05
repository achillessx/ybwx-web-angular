 var weixinShareUtil = (function() {


   var api = {
     "openid": "/ybwx-diplomat/wechat/open_id",
     "signature": "/ybwx-diplomat/wechat/js_signature"
   }

   function getOpenId() {
     var openId = sessionStorage.getItem("openId");
     
     if (openId) {
       return openId;
     }
     return $.ajax({
       type: 'GET',
       url: api["openid"],
       data: {
         code: code
       },
       dataType: "json"
     })
   }

   function getSign() {
     return $.ajax({
       type: 'GET',
       url: api["signature"],
       data: {
         "url": location.href.split('#')[0]
       },
       dataType: "json"
     })
   }

   function wxShareCallBack(a1, a2) {

     console.log(a1);
     console.log(a2);
     var openId;
     if (a1[0] && a1[0].data && a1[0].data["openid"]) {
       openId = a1[0].data["openid"];
       sessionStorage.setItem("openId", openId);
     }
     if (sessionStorage.getItem("openId")) {
       openId = sessionStorage.getItem("openId");
     }
     wx.config({
       debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
       appId: a2[0].data["app_id"], // 必填，公众号的唯一标识
       timestamp: a2[0].data["timestamp"], // 必填，生成签名的时间戳
       nonceStr: a2[0].data["noncestr"], // 必填，生成签名的随机串
       signature: a2[0].data["signature"], // 必填，签名，见附录1
       jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
     });
     wx.ready(function() {
       console.log("wexin success....")
       // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
       var shareTitle = "送你一份诺贝保险管家的100万航空意外险，平平安安过大年";
       var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx526ab87a436ee1c3&redirect_uri=' + encodeURIComponent(shareUrl + '?rec_id=' + openId) + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
       var shareDesc = "小伙伴也快来免费领取吧，你来领取还能再送我一份哦~";
       var shareImg = "http://web.youbaowuxian.com/wx_share/img/share_logo.png";

       wx.onMenuShareTimeline({
         title: shareTitle,
         link: shareLink,
         imgUrl: shareImg,
         success: function() {
           // alert(shareLink);
           console.log(shareLink);
         },
         cancel: function() {}
       });
       wx.onMenuShareAppMessage({
         title: shareTitle,
         desc: shareDesc,
         link: shareLink,
         imgUrl: shareImg,
         dataUrl: '',
         success: function() {
           // alert(shareLink);
           window.location.href = shareLink;
         },
         cancel: function() {}
       });

       wx.onMenuShareQQ({
         title: shareTitle,
         desc: shareDesc,
         link: shareLink,
         imgUrl: shareImg,
         success: function() {},
         cancel: function() {}
       });

       wx.onMenuShareWeibo({
         title: shareTitle,
         desc: shareDesc,
         link: shareLink,
         imgUrl: shareImg,
         success: function() {},
         cancel: function() {}
       });

       wx.onMenuShareQZone({
         title: shareTitle,
         desc: shareDesc,
         link: shareLink,
         imgUrl: shareImg,
         success: function() {},
         cancel: function() {}
       });
     });
     wx.error(function(res) {
       // alert(res);
       // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

     });
   }

   function share(shareUrl, isOnlyOpenId) {
     if (!isOnlyOpenId) {
       return $.when(getOpenId(), getSign()).done(wxShareCallBack);
     }
     return $.when(getOpenId()).done(function(res) {
       if (res && res.data && res.data["openid"]) {
         sessionStorage.setItem("openId", res.data["openid"]);
       }
     });
   }
   return {
     share: share
   }
 })()