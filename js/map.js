var colors = ['darkred', 'darkblue', 'darkgreen', 'orange', 'purple', 'darkpurple'];
// from http://colorbrewer2.org/?type=diverging&scheme=Spectral&n=5
var circleColors = ['rgb(215,25,28)','rgb(253,174,97)','rgb(255,255,191)','rgb(171,221,164)','rgb(43,131,186)'];
var map;
var from, to; 
var fromMarker, toMarker
var markerGroup, stopMarkerGroup, polylineGroup;

var reliability;

function createMap() {
	var centerLatLon = new L.LatLng(0,0);
	
    map = L.map('map');
   
    $.ajax(url, {
//      data: { routerId : 'default' },            
      dataType: 'JSON',
      success: function(data) {
      	var lat = 0, lon = 0;
      	$.each(data.polygon.coordinates[0],function() {
      	    lat += this[1];
      	    lon += this[0];
      	});

      	centerLatLon = new L.LatLng(lat/data.polygon.coordinates[0].length,
      			lon/data.polygon.coordinates[0].length);
      	
      	 map.setView(centerLatLon, 12);
      }
  });
    
	var from = [19.4 + Math.random()*0.01, -99.1-Math.random()*0.01];
	var to = [19.43 + Math.random()*0.01, -99.2+Math.random()*0.01];
    
	var stamenLayer = L.tileLayer(
		'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
		{
			attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
		})
		.addTo(map);
	
	addLegend();
	
	getPlan(from, to, drawPlan);
	
//	var popup = L.popup()
//    .setLatLng(centerLatLon)
//    .setContent('<p>Hello!<br/>Please click on the map twice to define start and goal of your travel.</p>')
//    .openOn(map);
}	

function getOverallReliability(itinerary) {
	var overall = 1.0
	for (var i = 0; i < itinerary.legs.length; i++) {
		if (itinerary.legs[i].reliability !== undefined) {
			overall *= itinerary.legs[i].reliability;
		}
	}
	return overall;
}

function drawPlan(plan) {
	clearMap();
	fromLatLon = [plan.from.lat, plan.from.lon];
	toLatLon = [plan.to.lat, plan.to.lon];
	drawMarkers(fromLatLon, toLatLon);
	drawTrips(plan.itineraries);
}

function drawMarkers(fromLatLon, toLatLon) {
		var fromMarker = L.marker(fromLatLon, {
			draggable:true})
  		.on('dragend', function(e) {
  			getPlan(e.target._latlng, toLatLon, drawPlan);
  		});
  		var toMarker = L.marker(toLatLon, {draggable:true})
  		.on('dragend', function(e) {
  			getPlan(fromLatLon, e.target._latlng, drawPlan);
  		});
  		markerGroup = new L.featureGroup([fromMarker, toMarker]).addTo(map);
}

function drawTrips(itineraries) {
	var polylines = [];
	var stopMarkers = [];
	$.each(itineraries, function(i, itinerary) {
//		if (i>0) return;
		var geometry = [];
		
		$.each(itinerary.legs, function(i, leg) {
			var nextLegGeom = decodePoints(leg.legGeometry.points, 5);
			geometry = geometry.concat(nextLegGeom);
			if (leg.mode === "WALK" 
				&& i > 0 && i < itinerary.legs.length-1) {  // do not show reliability for walk to and from the start and end
				var stopMarker = new L.circleMarker(geometry[geometry.length-1],
				{ 
				fill : true,
				fillColor: getCircleColor(leg.reliability)
				,fillOpacity:1});
				stopMarker.bindPopup('reliability: ' + leg.reliability);
				stopMarker.on("click", function(e) {
					var popup = L.popup()
				    .setLatLng(e.latlng)
				    .setContent('<p>Reliability of this transfer: <br />'+Math.round(100*leg.reliability)+'%</p>')
				    .openOn(map);
				});
				stopMarkers.push(stopMarker);
			}
		})
		
		
		var polyline = L.polyline(geometry, {color: colors[i],
		opacity:0.5});
		
		polyline.on('mouseover', function(e) {
		    var layer = e.target;
		    layer.setStyle({
		    	color:colors[i],
		        opacity: 1,
		        weight: 5
		    });
		});
		polyline.on('mouseout', function(e) {
		    var layer = e.target;
		    layer.setStyle({
		        color: colors[i],
		        opacity: 0.5,
		        weight: 5
		    });
		});
		polyline.on('click', function(e) {
			var popup = L.popup()
		    .setLatLng(e.latlng)
		    .setContent('<p>Reliability of this trip: <br />'+Math.round(100*reliability[polylines.indexOf(this)])+'%</p>')
		    .openOn(map);
//			alert(reliability[polylines.indexOf(this)]);
		});
		polylines.push(polyline);
	});
	polylineGroup = L.featureGroup(polylines).addTo(map);
	stopMarkerGroup = new L.featureGroup(stopMarkers).addTo(map);
	map.fitBounds(polylineGroup.getBounds(), {padding:[100, 100]});
	
	

}

function addLegend() {
	var legend = L.control({position: 'bottomright'});
	legend.onAdd = function (map) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = [90, 92, 94, 96, 98],
	        labels = [];

	    div.innerHTML += "<p><b>Reliability of transfer</b></p>"
	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	            '<i style="background:' + circleColors[i] + '"></i> ' +
	            (grades[i+1] ? grades[i] + '%&ndash;' + grades[i+1] + '%<br>' : '>'+grades[i]+"%");
	    }

	    return div;
	};

	legend.addTo(map);
}

function getCircleColor(reliability) {
	var index = Math.floor((reliability-0.9)/0.1 * (circleColors.length-1));
//	console.log(reliability + " -> " + circleColors[index]);
	return circleColors[index]; 
}

function clearMap() {
	if (markerGroup !== undefined) {
		markerGroup.clearLayers();
	}
	if (stopMarkerGroup !== undefined) {
		stopMarkerGroup.clearLayers();
	}
    for(i in map._layers) {
        if(map._layers[i]._path != undefined) {
            try {
            	map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}
		
