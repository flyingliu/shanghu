 var mapObj, polyline, dpolyline, geolocation, mouseTool, polylineOption, lastPoint = [],
   curPoint = [],
   lineArr = [],
   subline = [];
 var sorh = true;
 var storage = $.cookie();
 window.onload = function() {
   polylineOption = {
     strokeColor: "#FF33FF",
     strokeOpacity: 0.01,
     strokeWeight: 2
   };

   mapObj.plugin(["AMap.MouseTool"], function() {
     mouseTool = new AMap.MouseTool(mapObj);
     mouseTool.polyline(polylineOption);
     AMap.event.addListener(mouseTool, "draw", function(e) {
       var drawObj = e.obj; //obj属性就是绘制完成的覆盖物对象。
       var pointsCount = e.obj.getPath().length; //获取节点个数
       document.getElementById('resultInfo').innerHTML = "节点数：" + pointsCount + "<br>节点坐标：" + e.obj.getPath();
       console.log(drawObj);
     });
   });
 }

 function addpoint() {
   lastPoint = [curPoint[0], curPoint[1]];
   subline.push(lastPoint);
   lineArr.push(new AMap.LngLat(curPoint[0], curPoint[1]));
   addLine(lineArr);
 }

 function joinline() {
   var linename = $(".linename").val();
   $.cookie("line_" + linename, lineArr);
   console.log($.cookie("line_" + linename));
 }

 $(".tog").click(function() {
   if (sorh) {
     $(".lineifno").animate({
       "right": "0"
     });
     $(this).addClass('active');
     sorh = false;
     html = "";
     for (key in storage) {
        html += "<li>" + key.substr(5) + "</li>";
     }
     $("#lines").html("").html(html);
   } else {
     $(".lineifno").animate({
       "right": "-200px"
     });
     $(this).removeClass('active');
     sorh = true;
   }
 });

  $("#lines").on("click", "li", function() {
    if( !$(this).hasClass("active") ){
        $(this).addClass('active');
       var curkey = "line_" + $(this).text();
       var curValue =  $.cookie(curkey).split(",");
       var thisline = [];
       for(var i=0,len=curValue.length;i<len;i++){
        if(i%2==0){
          thisline.push(new AMap.LngLat(curValue[i], curValue[i+1]));
        };
       };
       addLine(thisline);
    }
})

 function addLine(line) {
   polyline = new AMap.Polyline({
     path: line, //设置线覆盖物路径
     strokeColor: "#3366FF", //线颜色
     strokeOpacity: 1, //线透明度 
     strokeWeight: 5, //线宽
     strokeStyle: "solid", //线样式
     strokeDasharray: [10, 5] //补充线样式 
   });
   polyline.setMap(mapObj);
 }

 function drawLine(line) {
   dpolyline = new AMap.Polyline({
     path: line, //设置线覆盖物路径
     strokeColor: "#ff0000", //线颜色
     strokeOpacity: 1, //线透明度 
     strokeWeight: 5, //线宽
     strokeStyle: "dashed", //线样式
     strokeDasharray: [10, 5] //补充线样式 
   });

   dpolyline.setMap(mapObj);
 }

 mapObj = new AMap.Map("map", {
   zoom: 16 //地图显示的缩放级别
 });
 mapObj.plugin(["AMap.ToolBar"], function() {
   toolBar = new AMap.ToolBar();
   mapObj.addControl(toolBar);
 });
 mapObj.plugin(["AMap.Scale"], function() {
   scale = new AMap.Scale();
   mapObj.addControl(scale);
 });
 mapObj.plugin('AMap.Geolocation', function() {
   geolocation = new AMap.Geolocation({
     enableHighAccuracy: true, //是否使用高精度定位，默认:true
     maximumAge: 60 * 1000, //定位结果缓存0毫秒，默认：0
     convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
     showButton: true, //显示定位按钮，默认：true
     buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
     buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
     showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
     showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
     panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
     // zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
   });
   geolocation.watchPosition();
   mapObj.addControl(geolocation);
   AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
   AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
 });
 time = 0, lat = 0, lng = 0;

 function onComplete(data) {
   // var html = '';
   // html += '<tr>';
   // html += '<td>' + data.position.getLat().toFixed(6) + '</td>';
   // html += '<td>' + data.position.getLng().toFixed(6) + '</td>';
   // html += '<td>' + parseFloat(data.accuracy).toFixed(2) + '</td>';
   // html += '<td>' + (((new Date().getTime()) - time) / 1000).toFixed(3) + '</td>';
   // html += '<td>' + (distance(data.position.getLat().toFixed(6), data.position.getLng().toFixed(6), lat, lng, 'K') * 1000).toFixed(3) + '</td>';
   // html += '<td>' + (data.isConverted ? '1' : '0') + '</td>';
   // html += '</tr>';
   // // alert(html);
   // // alert(document.getElementById('record'));
   // time = new Date().getTime();
   // lat = data.position.getLat().toFixed(6);
   // lng = data.position.getLng().toFixed(6);
   // $('tbody').html($('tbody').html() + html);

   curPoint = [data.position.getLng().toFixed(6), data.position.getLat().toFixed(6)]

   if (dpolyline) {
     dpolyline.setMap(null);
   }
   if (lastPoint.length > 0) {
     var curLine = [];
     curLine.push(new AMap.LngLat(lastPoint[0], lastPoint[1]));
     curLine.push(new AMap.LngLat(curPoint[0], curPoint[1]));
     drawLine(curLine);
   };

 };
 /*
  *解析定位错误信息
  */
 function onError(data) {};

 function distance(lat1, lon1, lat2, lon2, unit) {
   lat1 = parseFloat(lat1);
   lon1 = parseFloat(lon1);
   lat2 = parseFloat(lat2);
   lon2 = parseFloat(lon2);
   var radlat1 = Math.PI * lat1 / 180
   var radlat2 = Math.PI * lat2 / 180
   var radlon1 = Math.PI * lon1 / 180
   var radlon2 = Math.PI * lon2 / 180
   var theta = lon1 - lon2
   var radtheta = Math.PI * theta / 180
   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
   dist = Math.acos(dist)
   dist = dist * 180 / Math.PI
   dist = dist * 60 * 1.1515
   if (unit == "K") {
     dist = dist * 1.609344
   }
   if (unit == "N") {
     dist = dist * 0.8684
   }
   return dist
 }