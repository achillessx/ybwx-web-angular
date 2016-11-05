/* Radial pie menu implementation using jQuery and <canvas>.
 *
 * Copyright (c) 2009 Andreas Fuchs <asf@boinkor.net>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


/* See README.markdown for usage info. */

(function($) {
    var defaults = {
            closeRadius: 140,//中心圆半径
            radius:300,
            num:40,//指针的个数
            bigRadius:350,
            padding:20,
            outPadding:10,//指针和外园之间的距离
            closePadding: 3,
            closeSymbolSize: 7,
            imgWidth:60,//图标半径大小
            imgHeight:60,
            globalAlpha: 0.9,
            onSelection: function() {},
            className: null,
            elementStyle: null,
            selectedColor: '#87DDEA',
            backgroundColor: '#f4f4f4',
            disablebackgroundColor: '#F2F2F2',
            parentElement: 'body'
        },

        innerSegmentAngle = function(n) {
            return paddedSegmentAngle(n) - (Math.PI / 180) * 3;
        },

        paddedSegmentAngle = function(n) {
            return 2 * Math.PI / n;
        },

        startAngle = function(n, total) {
            return (-Math.PI / 2) + paddedSegmentAngle(total) * n;
        },

        endAngle = function(n, total) {
            return startAngle(n, total) + innerSegmentAngle(total);
        };
    

    var setSelectedColor = function(ctx,i, isSelected, options) {
        ctx.fillStyle = (isSelected ? options.selectedColor : options.backgroundColor);
        if(isSelected){
             ctx.fillStyle =  options.selectedColor;
        }else{
            ctx.fillStyle = (options.pieConfig[i].isDisable ? options.disablebackgroundColor : options.backgroundColor);
        }
    };

    $.fn.pieMenu = function(position, options) {
        $.each(defaults,
            function(defaultName, value) {
                if (!(defaultName in options))
                    options[defaultName] = value;
            });
        var canvas = document.createElement('canvas'),
            highlight = '',
            nSegments = options.pieConfig.length;


        var width =$(document).width()-options.padding;

        if(width>500){
            width=500;
        }
        var center = width;
        radius = width;//一共可绘图的半径
        options.closeRadius = radius*2/6;
        var dpr = 2;
        canvas.setAttribute('width', width * dpr);
        canvas.setAttribute('height', width * dpr);
        if (options.className){
            canvas.className = options.className;
        }
        $(canvas).css({
                width: width,
                height: width,
                margin: "0 auto",
                "-webkit-tap-highlight-color": "transparent",
                display: "block"
            })
            /*
            if (options.elementStyle)
                $(canvas).css(options.elementStyle);
            $(canvas).css({
                top: position.top - radius,
                left: position.left - radius
            });*/

        $(options.parentElement).append($(canvas));
        if (window.G_vmlCanvasManager) {
            // We're on IE, need to initialize the new canvas.
            window.G_vmlCanvasManager.initElement(canvas);
            canvas.unselectable = 'on'; // Make sure mouse clicks go through.
        }
        var draw = function() {
                var ctx = canvas.getContext('2d');
                ctx.globalAlpha = options.globalAlpha;
                ctx.strokeStyle = 'black';
                ctx.fillStyle = options.backgroundColor;
                ctx.lineCap = 'butt';
                ctx.lineJoin = 'round';
                ctx.lineWidth = 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                // Draw segments
                for (var i = 0; i < options.pieConfig.length; i++) {
                    setSelectedColor(ctx,i, i === highlight, options);
                    drawSlice(ctx, radius, i, nSegments,center);
                }

                //中心区
                ctx.beginPath();
                console.log("highlight:" + highlight);
                ctx.arc(center, center, options.closeRadius , 0, 2 * Math.PI);
                ctx.fillStyle = (highlight === 'x' ? options.selectedColor : "#FFF");
                ctx.fill();

                ctx.textAlign = "center";
                ctx.font = "normal 100px Arial,Microsoft YaHei";
                ctx.fillStyle = "#247ad1";
                ctx.fillText("4.5", center, center+15);
                ctx.font = "200 28px Arial,Microsoft YaHei";
                ctx.fillStyle = "#a3a3a3";
                ctx.fillText("您的保障系数", center, center + 50);

            },
            destroy = function() {
                $(canvas).remove();
            },
            onClick = function(e) {
                if(highlight!==null && highlight!=='')
                if (highlight >= 0 && highlight < nSegments) {
                    if (e.data)
                        e.data(highlight);
                }
                //destroy();
            },
            changeHighlight = function(e) {
                var prevHighlight = highlight;
                var posn = $(canvas).offset();
                // console.log("x:" + e.pageX);
                // console.log("y:" + e.pageY);
                var x = e.pageX - posn.left,
                    y = e.pageY - posn.top;
                x = x * dpr;
                y = y * dpr;
                var cX = canvas.width / 2,
                    cY = canvas.height / 2;
                var centerDistance = Math.sqrt((cX - x) * (cX - x) + (cY - y) * (cY - y));
                console.log("centerDistance:"+centerDistance);
                console.log("radius:"+radius);
                console.log("highlight:"+highlight);
                console.log("prevHighlight:"+prevHighlight);
                if (centerDistance < options.closeRadius) {
                    highlight = 'x';
                    /*
                    点中间的默认不让显示了。
                    if (highlight != prevHighlight){
                        draw();
                    }
                    */

//                } else if ( (centerDistance > (options.closeRadius + options.closePadding)) && (centerDistance<=radius) ) {
                } else if ( (centerDistance > (options.closeRadius )) && (centerDistance<=width) ) {
                    var dX = x - cX,
                        dY = y - cY;
                    var angle = null;
                    if (dX < 0){
                        angle = Math.PI + Math.asin(-dY / centerDistance);
                    }
                    else{
                        angle = Math.asin(dY / centerDistance);
                    }


                    for (var i = 0; i < options.pieConfig.length; i++) {
//                        if (startAngle(i, nSegments) < angle && endAngle(i, nSegments) >= angle && !options.pieConfig[i].isDisable) {
                        if (startAngle(i, nSegments) < angle && endAngle(i, nSegments) >= angle) {
                            highlight = i;
                            break;
                        }
                    }
                    /*
                     $('img', menu).each(
                         function(i, img) {
                             if (startAngle(i, nSegments) < angle &&
                                 endAngle(i, nSegments) >= angle) {
                                 highlight = i;
                                 return false;
                             }
                             return true;
                         });*/
                    if (highlight != prevHighlight){
                        draw();
                    }
                }else if (centerDistance>width) {
                     highlight = '';
                        draw();

                }
            },
            toAngle = function(x) {
                return x * 180 / Math.PI
            },
            preLoadImg = function(url, callback) {
                var img = new Image(); //创建一个Image对象，实现图片的预下载  
                img.src = url;

                if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数  
                    callback.call(img);
                    return; // 直接返回，不用再处理onload事件  
                }

                img.onload = function() { //图片下载完毕时异步调用callback函数。  
                    callback.call(img); //将回调函数的this替换为Image对象  
                };
            },
            drawSlice = function(ctx, radius, n, total,center) {
                var startA = startAngle(n, total),
                    endA = endAngle(n, total);
                console.log("startA:" + toAngle(startA));
                console.log("endA:" + toAngle(endA));
                console.log("startA:" + (startA));

                var bigRadius = radius*5.5/7;


                /*
                debug...
                ctx.moveTo(center, center);
                ctx.lineTo(center+bigRadius, center);
                ctx.moveTo(center, center+10);
                ctx.lineTo(center+radius, center+10);
                ctx.stroke();
                */


                ctx.beginPath();
                ctx.arc(center, center, options.closeRadius,
                    startA, endA, false);//内环
                ctx.arc(center, center, bigRadius, endA+0.03, startA, true);//标准的扇形为内部窄外部宽。给外边加一个弧度，让看起来是等宽的。外边缘
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.strokeStyle="#247ad1";
                ctx.arc(center, center, options.closeRadius, startA, endA, false);//内环
                ctx.stroke();
                ctx.closePath();



        
                var angDis = (endA+0.04-startA)/options.num;
                var secHandLength = bigRadius+options.outPadding;
                ctx.lineWidth = 1;
                for(var i =0;i<options.num;i++){
                     var angle = startA+angDis*i;
                     var percent = i/options.num;
                     ctx.beginPath();
                     ctx.save();
                     ctx.translate(  center ,  center ); 
                     var x1 =  Math.cos(angle) * (secHandLength);
                     var y1 =   Math.sin(angle) * (secHandLength);
                     var x2 =   Math.cos(angle) * (secHandLength + (secHandLength / 7));
                     var y2 =   Math.sin(angle) * (secHandLength + (secHandLength / 7));
                      
                     if(percent<=options.pieConfig[n].percent){
                         ctx.strokeStyle=options.pieConfig[n].color;
                     }else{
                         ctx.strokeStyle="#bcbcbc";
                     }
                    // ctx.strokeStyle="#000";
                     ctx.moveTo(x1, y1);
                     ctx.lineTo(x2, y2);
                     //console.log(x1+":"+y1);
                     //console.log(x2+":"+y2);
                     ctx.stroke();
                     ctx.closePath();
                     ctx.restore();
                }
                var textHandLength = secHandLength+20;
                var middleAngle = (startA+endA)/2;
                ctx.beginPath();
                ctx.save();
                ctx.translate(  center ,  center ); 
                ctx.textAlign = "center";
                ctx.font = "normal 35px Arial,Microsoft YaHei";
                ctx.fillStyle = options.pieConfig[n].textColor;
                ctx.fillText(options.pieConfig[n].percent*10,  Math.cos(middleAngle) * textHandLength, Math.sin(middleAngle) * textHandLength+15);
                ctx.restore();
                ctx.closePath();



                console.log(".....................................")
        
            

                //                用图片来化
                if (options.pieConfig[n].img) {
                    preLoadImg(options.pieConfig[n].img, function() {
                        var iconW = options.imgWidth;
                        var iconH = options.imgHeight;

                        /*
                         if(screen.height<=480){
                             iconW = options.imgWidth*0.8;
                             iconH = options.imgHeight*0.8;
                        }*/
                        var iconCenterRadius = center*2/3 - Math.max(iconW, iconH) / 2 ;
                        var midAngle = startA + (endA - startA) / 2;
                        var iconX = Math.cos(midAngle) * iconCenterRadius;
                        var iconY = Math.sin(midAngle) * iconCenterRadius-20;
                        ctx.drawImage(this, center + iconX-iconW/2 , center + iconY-iconH/2,iconW,iconH);
                        ctx.textAlign = "center";
                        ctx.font = " normal  25px Arial,Microsoft YaHei";
                        ctx.fillStyle = "#6f6f6f";
                        ctx.fillText(options.pieConfig[n].text, center + iconX, center + iconY+60);
                    })

                }


            };

        $(canvas).
        mousemove(changeHighlight).
        mouseleave(function(e) {
            highlight = null;
            draw();
        }).
        bind('click', options.onSelection, onClick);
        draw();
    };
}(jQuery));