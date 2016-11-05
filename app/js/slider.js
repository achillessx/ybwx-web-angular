$(function() {
var baxMax = $(document).width()-60-40-30;//减去wraper的padding，减去container的padding

load();
function load() {
		document.getElementById("zhizhen").addEventListener('touchstart', touch, false);
		document.getElementById("zhizhen").addEventListener('touchmove', touch, false);
		document.getElementById("zhizhen").addEventListener('touchend', touch, false);

	    //document.getElementById("chartTextContainer").addEventListener('touchstart', touch, false);
		//document.getElementById("chartTextContainer").addEventListener('touchmove', touch, false);
		//document.getElementById("chartTextContainer").addEventListener('touchend', touch, false);


		var startX;
		var barWidth = 0 ;
		var barMin = 0;
		
		function touch(event) {
			var event = event || window.event;
			switch (event.type) {
				case "touchstart":
					startX = event.touches[0].clientX;
					console.log("Touch started (" + event.touches[0].clientX + "," + event.touches[0].clientX + ")");
					break;
				case "touchend":
					console.log("<br/>Touch end (" + event.changedTouches[0].clientX + "," + event.changedTouches[0].clientY + ")");
					var dis = event.changedTouches[0].clientX - startX;
					//dis=dis*1.2;
					//angle = angle + dis * 360 / width;
					barWidth =  barWidth + dis;
					//console.log("mov:" + dis);
					drawDis = barWidth;
					if(drawDis<=barMin){
						drawDis = barMin;
					}
					console.log("baxMax:"+baxMax);
					if(drawDis>=baxMax){
						drawDis = baxMax;
					}
					$("#bar").width(drawDis);
					$("#zhizhen").css("left",drawDis);
					/*
					$("#btnCircle").css("left",drawDis);
					$("#bar_score").css("left",drawDis);
					$("#bar_money").css("left",drawDis-10);
					*/
					break;
				case "touchmove":
					event.preventDefault();
					var dis = event.touches[0].clientX - startX;
					var drawDis = barWidth + dis;
					if(drawDis<=barMin){
						drawDis = barMin;
					}
					if(drawDis>=baxMax){
						drawDis = baxMax;
					}
					$("#bar").width(drawDis);


					$("#zhizhen").css("left",drawDis);
					//$("#btnCircle").css("left",drawDis);
					//$("#bar_score").css("left",drawDis);
					//$("#bar_money").css("left",drawDis-10);
					console.log("baxMax:"+baxMax);
			
					break;
			}
		}
	}




});