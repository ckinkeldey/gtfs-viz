function initData(route_id) {
	var p = 1.0;
	 $.ajax(url + "index/routes/"+route_id+"/stops", {
	        dataType: 'JSON',
	        success: function(stops) {
	        	$.each(stops,function(i, stop) {
//	        		$.ajax(url + "index/stops/"+stops[0].id+"/stoptimes", {
//	        	        dataType: 'JSON',
//	        	        success: function(stoptime) {
//	        	        	console.log(stoptime);
//	        	        }
        		$.get(url + "index/stops/"+stop.id+"/stoptimes", function(stoptimes) {
//        	        	console.log(stoptimes.length);
        	        	$.each(stoptimes,function(i, stoptime) {
        	        		$.each(stoptime.times,function(i, time) {
        	        			var random = 0.1;//Math.random();
        	        			p *= random <= 0.1 ? (1.-random) : 1.;
//	        	        		if (time.arrivalDelay > 0) {
//	        	        			console.log("arrival delay == " + stoptime.times[0].arrivalDelay);
//	        	        		}
//	        	        		if (time.departureDelay > 0) {
//	        	        			console.log("departure delay == " + stoptime.times[0].departureDelay);
//	        	        		}
        	        		});
        	        	});
        	        }
	        		);
	          	});
	        },
	        error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert("fail");
			}
	  });
	 
	 // overall probability
     console.log("p == " + p);
}

function decodePoints(encoded, precision) {
    precision = Math.pow(10, -precision);
    var len = encoded.length, index=0, lat=0, lng = 0, array = [];
    while (index < len) {
        var b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;
        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;
        array.push( [lat * precision, lng * precision] );
    }
    return array;
}