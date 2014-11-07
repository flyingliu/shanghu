var mapObj,
		markers= [],
		groundImage,
		polyline_array = [];

var myline = [
	[
		[120.68563,31.644462],
		[120.685506,31.644147] 
	],
	[
		[120.688732,31.642958],
		[120.688651,31.642821]
	],
	[
		[120.690308,31.638334],
		[120.690281,31.638548] 
	],
	[
		[120.683012,31.63691],
		[120.6832,31.637011] 
	],
	[
		[120.686238,31.640738],
		[120.686356,31.640591] 
	],
	[
		[120.687426,31.639519],
		[120.687501,31.63945] 
	],
	[
		[120.685818,31.642901],
		[120.685689,31.642869] 
	],
	[
		[120.688222,31.643688],
		[120.688287,31.643765]
	]
];

function mapController($scope,$http) {

	$scope.showpoi = function(){
    $http.get("/json/poi.json",{cache: true}).success(function(data) {
      $scope.pois = data.data;
      addMarker($scope.pois);
    })
	}

	$scope.selpoi = function(type){
		for(var i=0,len = markers.length;i<len;i++){
			markers[i].setMap(null);
		}
		markers = [];

    $http.get("./json/poi.json",{cache: true}).success(function(data) {
      var nodes =  data.data;
      var newnodes = _.filter(nodes, function(item){ return item.location_type_id == type; });
      console.log(newnodes);
      addMarker(newnodes,type);

    })


		console.log(polyline_array.length); 
		for(var i=0,len = polyline_array.length;i<len;i++){
			polyline_array[i].setMap(null);
		}
		polyline_array = [];

	}

	$scope.showline = function(){
    $http.get("./json/line.json",{cache: true}).success(function(data) {
      $scope.line = eval(data.line);
      var lines = $scope.line; 
			addLine(lines);    	
    })
	}	
}


function addLine(datas) {
  if(polyline_array.length==0){
	  var lineArr = [];//创建线覆盖物节点坐标数组
		if (datas.length > 0) {
			var datalength = datas.length;
			for (var i = 0; i < datalength; i++) {
				var gps = datas[i];
				if (i == 0) {
					lineArr[0] = [];
					lineArr[0].push(new AMap.LngLat(gps[0], gps[1]));
					continue;
				}
				var pre_lat = datas[i - 1];
				var lnglat = new AMap.LngLat(gps[0], gps[1]);
				var pre_lnglat = new AMap.LngLat(pre_lat[0], pre_lat[1]);
				var key = lineArr.length;
				if (lnglat.distance(pre_lnglat) > 100) {
					if (typeof lineArr[key] == "undefined") {
						lineArr[key] = [];
					}
					lineArr[key].push(lnglat);
				} else {
					if (typeof lineArr[key - 1] == "undefined") {
						lineArr[key - 1] = [];
					}
					lineArr[key - 1].push(lnglat);
				}
			}


			var MyLineArr = []
			for(var i=0,len=myline.length;i<len;i++){
				MyLineArr[i] = [];
				for(var j=0;j<myline[i].length;j++){
					MyLineArr[i].push(new AMap.LngLat(myline[i][j][0],myline[i][j][1])); 
				};
			}

			for (i = 0; i < MyLineArr.length; i++) {
				mypolyline = new AMap.Polyline({
					path: MyLineArr[i],
					strokeColor:"#3366FF", //线颜色
					strokeOpacity:1, //线透明度 
					strokeWeight:3, //线宽
					strokeStyle:"solid", //线样式
					strokeDasharray:[10,5] //补充线样式 
				});

				polyline_array.push(mypolyline);
				mypolyline.setMap(mapObj);
			}



			for (i = 0; i < lineArr.length; i++) {
				polyline = new AMap.Polyline({
					path: lineArr[i],
					strokeColor:"#3366FF", //线颜色
					strokeOpacity:1, //线透明度 
					strokeWeight:3, //线宽
					strokeStyle:"solid", //线样式
					strokeDasharray:[10,5] //补充线样式 
				});

				polyline_array.push(polyline);
				polyline.setMap(mapObj);
			}
		}
	}
}

function addMarker(rs,type){
	if(markers.length == 0){
	  for(var i in rs){
	    var m = document.createElement("div");
	    m.className = "marker marker_"+type;
	    var n = document.createElement("a");
	    n.innerHTML = rs[i].name;
	    n.style.width = n.innerHTML.length + "em";
	    m.appendChild(n);
	    var marker = new AMap.Marker({
	        map:mapObj, 
	        position:new AMap.LngLat(rs[i].longitude,rs[i].latitude),
	        offset:new AMap.Pixel(0,-40),
	        content:m 
	    });    
	    marker.setMap(mapObj); 
	    markers.push(marker);             
	  }
	}
}


function mapInit() {
	var bottomlef = [120.679450035095,31.6323370536687],
      topright = [120.69356918335,31.6493628821165],
      CenterLati = (120.69356918335+120.679450035095)/2,
      CenterLong = (31.6323370536687+31.6493628821165)/2;
	mapObj = new AMap.Map('map'),
		bounds = new AMap.Bounds(new AMap.LngLat(bottomlef[0], bottomlef[1]), new AMap.LngLat(topright[0], topright[1])),
		groundImageOpts = {
			opacity: 0.8,   //图片透明度
			clickable: true,//图片相应鼠标点击事件，默认：false
			map: mapObj     //图片叠加的地图对象
		};
	//实例化一个图片覆盖物对象
	groundImage = new AMap.GroundImage('./js/map.png', bounds, groundImageOpts);
	mapObj.setBounds(bounds);

	mapObj.setZoomAndCenter(17,new AMap.LngLat(CenterLati, CenterLong));

	var clickEventListener=AMap.event.addListener(mapObj,'click',function(e){
		console.log("["+ e.lnglat.getLng() + "," + e.lnglat.getLat() + "]");  
	});

}

function init(){
	var allWidth = $('body').width();
	var allHeight = $('body').height();
	var mapHeight = allHeight - 91;
	var mapWidth = allWidth -240;
	$(".aside").height(mapHeight);
	$(".map").height(mapHeight);
	$(".map").width(mapWidth);	
	
}

$(function(){
	init();

	$(window).resize(function(){
		init();
	})

	$("#aside li").click(function(){
		$(this).parent().find("li").removeClass("active");
		$(this).addClass("active");
	});

	$(".kele").click(function(){
		$(".overlay").animate({"right":"-100%"});
	});

	$(".showinfo").click(function(){
		$(".info").show();
		$("#ifcon").hide();
		$(".overlay").animate({"right":"0"});
	});

	$(".showif dd").click(function(){
		var src = $(this).attr("rel");
		html = "<iframe src='"+ src +"'></iframe>"
		$("#ifcon").show().html("").append(html);
		$(".info").hide();
		$(".overlay").animate({"right":"0"});
	});
})