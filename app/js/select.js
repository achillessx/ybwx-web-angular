$(function() {

	var config = {
		marginTop: 20,
		padding: 60,
		lineWidth: 30,
		closePadding: 40,
		dpr: 3
	}
	var MIN_ANGLE = -Math.PI/2;
	var MAX_ANGLE = 3 * Math.PI/2;
	var TWO_PI = 2*Math.PI;
	var angle = 0;
	var bgCanvas = document.getElementById("bgchartContainer");
	var canvas = document.getElementById("chartContainer");
	var width = $(document).width() - config.padding;
	console.log("document width:" + $(document).width());
	if (width > 500) {
		width = 500;
	}
	var height = parseInt(width) + config.marginTop;
	console.log(width);
	console.log(height);
	var radius = width; //一共可绘图的半径
	bgCanvas.setAttribute('width', width * config.dpr);
	bgCanvas.setAttribute('height', height * config.dpr);
	$(bgCanvas).css({
		width: width,

		height: height,
		display: "block"
	})

	canvas.setAttribute('width', width * config.dpr);
	canvas.setAttribute('height', height * config.dpr);
	$(canvas).css({
		width: width,
	
		height: height,
		display: "block"
	})

	var ctx = canvas.getContext("2d");
	var ctxBg = bgCanvas.getContext("2d");
	var radius = canvas.width / 2;
	var radiusX = radius;
	var radiusY = (canvas.height ) / 2;
	var mHold = 0;
	ctx.translate(radiusX, radiusY);
	ctxBg.translate(radiusX, radiusY);
	radius = radius * 0.75;
	drawFace(ctx, radius, angle);
	load();
	drawBg(ctxBg);

	$(".canvas_text").css({
		'left': (radiusX) / config.dpr,
		'top': (radiusY - radius / 3) / config.dpr
	})

	function load() {
		document.getElementById("clockContainer").addEventListener('touchstart', touch, false);
		document.getElementById("clockContainer").addEventListener('touchmove', touch, false);
		document.getElementById("clockContainer").addEventListener('touchend', touch, false);

		//var startX;
		//var startY;
		var offs = $("#chartContainer").offset();
		var elPos = {
			x: offs.left,
			y: offs.top
		};
		var PI2 = Math.PI / 180;
		var lastX = 0;
		var lastY = 0;

		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":

					var mPos = {
						x: event.changedTouches[0].pageX - elPos.x,
						y: event.changedTouches[0].pageY - elPos.y
					};//动作点相遇于canvas的坐标
					var currentX = mPos.x - radiusX / config.dpr;
					var currentY = mPos.y - radiusY / config.dpr; //以圆心作为远点，当前事件的坐标点.
					//var dis = Math.round(Math.sqrt(Math.pow(currentX, 2) + Math.pow(currentY, 2))); //当前事件半径
					//var atan = Math.atan2(currentX, currentY); //返回从0度到当前坐标逆时针所转的角度 单位是弧度。注意这里将x，y坐标调换，然后转化成为从（0，y）开始的角度
					//var deg = -atan / PI2 + 180; //转化成度数，
					//alert("deg:"+deg)
					//alert("angle:"+angle)

					/*
					if (Math.abs(deg - angle) < 30 && Math.abs(dis - radius / config.dpr) < 250) {
						mHold = 1;
					}*/
					//console.log("deg:" + deg);

					var ang = angle * Math.PI / 180;//当前刻度的位置
					var keduRadius = (radius + config.lineWidth / 2);	
					var keduX = (keduRadius/config.dpr)* Math.cos(-Math.PI / 2 + ang);
					var keduY = (keduRadius/config.dpr)* Math.sin(-Math.PI / 2 + ang);
					var distance =  Math.round(Math.sqrt(Math.pow(currentX-keduX, 2) + Math.pow(currentY-keduY, 2)));

					if(distance<30){
						mHold = 1;
					}

					//console.log("newDeg:" + (Math.atan2(currentY, currentX) / PI2));

					/*
					console.log("screenX:" + event.changedTouches[0].screenX);
					console.log("pageX:" + event.changedTouches[0].pageX);
					console.log("pageY:" + event.changedTouches[0].pageY);
					console.log("clientX:" + event.changedTouches[0].clientX);
					console.log("clientY:" + event.changedTouches[0].clientY);
					*/
					/*
					var ang = deg * Math.PI / 180;
					var keduRadius = (radius + config.lineWidth / 2);
					console.log("deg:" + deg);
					console.log("angle:" + angle);
					console.log("currentX:" + (currentX));
					console.log("currentY:" + (currentY));
					console.log("keduX:" + (keduRadius/config.dpr)* Math.cos(-Math.PI / 2 + ang));
					console.log("keduY:" + (keduRadius/config.dpr) * Math.sin(-Math.PI / 2 + ang));*/
					/*
					console.log("deg:" + deg);
					console.log("dis:" + dis);
					console.log("radius:" + radius / config.dpr);
					console.log("angle:" + angle);
					console.log("currentX:" + (currentX));
					console.log("currentY:" + (currentY));
					console.log("kedu:" + (radius + config.lineWidth / 2) * Math.cos(-Math.PI / 2 + angle));
					console.log("kedu:" + (radius + config.lineWidth / 2) * Math.sin(-Math.PI / 2 + angle));
					console.log("Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")");
					*/

					break;
				case "touchend":
					//console.log("<br/>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")");
					mHold = 0;
					break;
				case "touchmove":

					if (mHold) {
						event.preventDefault();
						console.log("...........................");
						var mPos = {
							x: event.changedTouches[0].pageX - elPos.x,
							y: event.changedTouches[0].pageY - elPos.y
						};
						var currentX = mPos.x - radiusX / config.dpr;
						var currentY = mPos.y - radiusY / config.dpr;
						var atan = Math.atan2(currentX, currentY);
						var deg = -atan / PI2 + 180;
						deg = Math.floor(deg);

						if (lastX < 0 && lastY < 0) { //防止从左侧滑到右侧
							if (currentX >= 0 && currentY <= 0 || currentX > 0 && currentY > 0) {
								lastX=-0.01;	
								lastY=-radiusY / config.dpr;	
								angle = 360;
								drawFace(ctx, radius, 360);
								return;
							}
						}
						if (lastX >= 0 && lastY <= 0) { //防止从右侧滑动到左侧
							if (currentX < 0 && currentY < 0 || currentX < 0 && currentY > 0) {

								lastX=0.01;	
								lastY=-radiusY / config.dpr;
								angle = 0;

								drawFace(ctx, radius, 0);
								return;
							}
						}

						/*
						console.log(mPos);
						console.log("atanX:" + (currentX));
						console.log("atanY:" + (currentY));
						console.log("atan:" + atan);
						console.log("deg:" + deg);
						console.log("angle:" + angle);
						console.log("drawAngle:" + drawAngle);
						*/
						angle=deg;
						lastX = currentX;
						lastY = currentY;
						drawFace(ctx, radius, angle);
						//console.log("<br/>Touch moved (" + event.touches[0].clientX + "," + event.touches[0].clientY + ")");
					}
					break;
			}
		}
	}


	function drawBg(ctx) {//背景是指示标

		var angleMin = -Math.PI / 4;
		var indrodRadius = config.lineWidth + radius + 80;
		ctx.beginPath();
		ctx.arc(0, 0, indrodRadius, -Math.PI / 2, angleMin);
		ctx.strokeStyle = '#bdd7f1';
		ctx.lineWidth = 12;
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(indrodRadius * Math.cos(angleMin), indrodRadius * Math.sin(angleMin));
		ctx.lineTo(indrodRadius * Math.cos(angleMin) - 40, indrodRadius * Math.sin(angleMin) - 70);
		ctx.stroke();

	}

	function drawFace(ctx, radius, angle) {

		if (angle < 0) {
			angle = 0;
		}
		if (angle > 360) {
			angle = 360;
		}

		var smallRadius = radius;
		var bigRadius = radius + config.lineWidth;

		//ctx.clearRect(0, 0, bigRadius, bigRadius);

		ctx.beginPath();
		ctx.arc(0, 0, bigRadius + 95, 0, 2 * Math.PI);
		ctx.fillStyle = "#fff";
		ctx.fill();

		/*
		var indrodRadius = config.lineWidth + radius + 50;
		ctx.beginPath();
		ctx.arc(0, 0, indrodRadius, -Math.PI / 2, -Math.PI / 4);
		ctx.strokeStyle = '#91bce8';
		ctx.lineWidth = 10;
		ctx.stroke();

		ctx.moveTo(indrodRadius * Math.cos(-Math.PI / 4), indrodRadius * Math.sin(-Math.PI / 4));
		ctx.lineTo(indrodRadius * Math.cos(-Math.PI / 4) - 20, indrodRadius * Math.sin(-Math.PI / 4) - 80);
		ctx.stroke();
		*/


		/**/
		ctx.beginPath();
		ctx.arc(0, 0, bigRadius, 0, TWO_PI);
		ctx.fillStyle = "#e0e0e0";
		ctx.fill();



		ctx.beginPath();
		ctx.arc(0, 0, smallRadius, 0, TWO_PI);
		ctx.fillStyle = "#fff";
		ctx.fill();
		

		var ang = angle * Math.PI / 180;
		var angFrom90 = -Math.PI / 2 + ang;

        
		ctx.beginPath();
		ctx.arc(0, 0, smallRadius + config.lineWidth / 2,MIN_ANGLE, angFrom90, false); //当前大圆环的刻度
		ctx.lineWidth = config.lineWidth;
		ctx.strokeStyle = '#247ad1';
		ctx.stroke();


/*
	    ctx.beginPath();
		ctx.arc(0, 0, smallRadius + config.lineWidth / 2, angFrom90,MAX_ANGLE , false); //当前大圆环的刻度灰色
		ctx.lineWidth = config.lineWidth;
		ctx.strokeStyle = '#e0e0e0';
		ctx.stroke();
*/


		console.log("angle:"+angle);


		ctx.beginPath();
		ctx.arc(0, 0, smallRadius - config.closePadding, MIN_ANGLE, angFrom90, false); //内环线蓝色
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#3282d4';
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(0, 0, smallRadius - config.closePadding, angFrom90, MAX_ANGLE, false); //内环线灰色
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#e7e7e7';
		ctx.stroke();



		//当前刻度圆环的画法
		var keduRadius = smallRadius + config.lineWidth / 2;
		var cosX = Math.cos(angFrom90);
		var sinX = Math.sin(angFrom90);
		var keduX = keduRadius* cosX;
		var keduY = keduRadius* sinX;

		ctx.beginPath();
		ctx.arc(keduX, keduY, 40, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#91bce8";
		ctx.fill();


		ctx.beginPath();
		ctx.arc(keduX, keduY, 20, 0, TWO_PI, false); //当前刻度
		ctx.fillStyle = "#fff";
		ctx.fill();


		/* */
		//console.log("angle:" + ang);
		//console.log("keduX:" + keduRadius * Math.cos(-Math.PI / 2 + ang));
		//console.log("keduY:" + keduRadius * Math.sin(-Math.PI / 2 + ang));


		//当前的百分比得分
		ctx.textAlign = "right";
		var textRadius = bigRadius + 55;
		ctx.font = "normal 50px Arial,Microsoft YaHei";
		ctx.fillStyle = "#f65066";
		var textX = (textRadius) * cosX+10;
		var textY = (textRadius) * sinX+20;
		//console.log("angle:" + angle);
		ctx.fillText(Math.floor(angle / 36), textX, textY);

		//console.log("textX:" + textX);
		//console.log("textY:" + textY);
		
	}

})