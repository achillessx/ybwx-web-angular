var util={
	getParameterByName :  function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	showToast:function($rootScope,msg){
	$rootScope.server_reason = msg;
	 $("#toast").show();
	 setTimeout(function(){
		 $("#toast").fadeOut();
	 }, 2000);
	},
	sendMail:function($http,$rootScope,url,openId,email,order_no){
				$http({
					method: 'POST',
					headers: {
						"Content-Type": "application/json;charset:UTF-8"
					},
					url: url,
					data: {
						"open_id": openId,
						"email": email,
						"order_no": order_no
					}
				}).then(function(res) {
					console.log(res);
					if (res.data && res.data.description) {
						util.showToast($rootScope, res.data.description);
					} else if (res.data.code === 0) {
						util.showToast($rootScope, "邮件发送成功，请注意查收");
					}
				}, function(res) {
					console.log(res);
					util.showToast($rootScope, "服务器错误");
				});
	}
}